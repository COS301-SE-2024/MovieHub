const neo4j = require('neo4j-driver');
require('dotenv').config();

import {getMovieDetails} from '../services/tmdb.service';

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);


exports.addMovie = async (movieId) => {
    const session = driver.session();
    const exists = await movieExistsLocal(movieId)
 console.log(exists);
    if(exists){
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

exports.getMovieByActor = async (actorName) => {
    const session = driver.session();
    console.log("getMovieByActor", actorName);
   
    

};

exports.getMoviesByGenre = async (genre) => {
    const session = driver.session();
    console.log("getMoviesByGenre", genre);

};

exports.getSimilarMovies = async (movieId) => {

};

exports.addRating = async (userId, movieId, rating) => {

};

exports.getRatings = async (userId) => {

};




