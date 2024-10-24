const neo4j = require('neo4j-driver');
require('dotenv').config();

import { getMovieDetails } from '../services/tmdb.service';

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);


exports.addMovie = async (movieId) => {
    const session = driver.session();
    const exists = await movieExistsLocal(movieId)
    console.log(exists);
    if (exists) {
        return true;
    }

    const movieDetails = await getMovieDetails(movieId);

    const releaseDate = movieDetails.release_date;
    const overview = movieDetails.overview;
    const posterPath = movieDetails.poster_path;
    const title = movieDetails.title;
    try {
        await session.run(
            `
            CREATE (m:Movie {
                movieId: $movieId,
                overview: $overview,
                posterPath: $posterPath,
                releaseDate: $releaseDate,
                title: $title
            })
            RETURN m
            `,
            { movieId, overview, posterPath, releaseDate, title }
        );
        return true;
    } finally {
        await session.close();
    }
};

const movieExistsLocal = async (movieId) => {
    const session = driver.session();
    console.log("movieExists", movieId);

    try {
        const result = await session.run(
            `MATCH (m:Movie {movieId: $movieId}) RETURN m`,
            { movieId }
        );
        return result.records.length > 0;

    } catch (error) {
        console.error('Error checking if movie exists:', error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.movieExists = async (movieId) => {
    const session = driver.session();
    console.log("movieExists", movieId);
    movieId = parseFloat(movieId);
    try {
        const result = await session.run(
            `MATCH (m:Movie {movieId: $movieId}) RETURN m`,
            { movieId }
        );
        return result.records.length > 0;

    } catch (error) {
        console.error('Error checking if movie exists:', error);
        throw error;
    } finally {
        await session.close();
    }
};


exports.getMovieDetails = async (movieId) => {
    const session = driver.session();
    console.log("getMovieDetails", movieId);

    try {
        const result = await session.run(
            `MATCH (m:Movie {movieId: $movieId}) RETURN m`,
            { movieId }
        );
        if (result.records.length === 0) {
            throw new Error('Movie not found');
        }
        const movie = result.records[0].get('m').properties;
        return movie;

    } catch (error) {
        console.error('Error getting movie details:', error);
        throw error;
    } finally {
        await session.close();
    }
};


exports.getSuggestedMoviesForUser = async (uid) => {
    const session = driver.session();
    console.log("getSuggestedMoviesForUser", uid);

    try {
        // Step 1: Get the favorite genres of the user
        const favoriteGenresResult = await session.run(
            `MATCH (u:User {uid: $uid})
             RETURN u.favouriteGenres AS favoriteGenres`,
            { uid }
        );

        if (favoriteGenresResult.records.length === 0) {
            throw new Error('User not found');
        }
        

        const favoriteGenres = favoriteGenresResult.records[0].get('favoriteGenres');

        // Step 2: Find other users with similar favorite genres
        const similarUsersResult = await session.run(
            `MATCH (other:User)
             WHERE any(genre IN other.favouriteGenres WHERE genre IN $favoriteGenres) AND other.uid <> $uid
             RETURN other.uid AS similarUserUid`,
            { favoriteGenres, uid }
        );

        const similarUserUids = similarUsersResult.records.map(record => record.get('similarUserUid'));
       

        if (similarUserUids.length === 0) {
            return [];  // No similar users found
        }

        // Step 3: Compile a list of movies based on the interactions of the similar users, prioritizing watchlists with matching tags
        const suggestedMoviesResult = await session.run(
            `MATCH (other:User)-[:REVIEWED]->(r:Review)-[:REVIEWED_ON]->(m:Movie)
                WHERE other.uid IN $similarUserUids AND r.rating > 5  // Only consider positive reviews
                OPTIONAL MATCH (other)-[:HAS_WATCHLIST]->(w:Watchlist)-[:INCLUDES]->(m)
                WITH m, COLLECT(DISTINCT w.tags) AS allTags, 
                    count(DISTINCT r) AS ratingCount, avg(r.rating) AS avgRating
                OPTIONAL MATCH (u:User {uid: $uid})-[:HAS_WATCHLIST]->(uw:Watchlist)-[:INCLUDES]->(m)
                WITH m, ratingCount, avgRating, apoc.coll.flatten(allTags) AS allTagsFlat, 
                    coalesce(uw, false) AS isInUserWatchlist
                WHERE NOT isInUserWatchlist  // Exclude movies already in the user's watchlist
                WITH m, ratingCount, avgRating, 
                    size(apoc.coll.intersection(allTagsFlat, $favoriteGenres)) AS matchingTagsCount
                RETURN DISTINCT m AS movie, ratingCount, matchingTagsCount AS priority, avgRating
                ORDER BY priority DESC, avgRating DESC, ratingCount DESC  // Prioritize by matching tags, then by rating count
                LIMIT 10`,  // Adjust limit as needed
            { similarUserUids, favoriteGenres, uid }
        );

        const suggestedMovies = suggestedMoviesResult.records.map(record => record.get('movie').properties);

        return suggestedMovies;

    } catch (error) {
        console.error('Error fetching suggested movies:', error);
        throw error;
    } finally {
        await session.close();
    }
};







