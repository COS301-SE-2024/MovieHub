const { Client } = require('@elastic/elasticsearch');
const { getMovieDetails } = require('../services/tmdb.service');
const vectorizeMovies = require('../utils/vectorizeMovies');
const cosineSimilarity = require('compute-cosine-similarity');
const setupIndex = require('../scripts/setupElastic');
const indexMovies = require('../scripts/indexMovies');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const client = new Client({ node: 'http://localhost:9200' });

// New function to get user favorite genres
const getUserFavoriteGenres = async (userId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u:User {uid: $userId}) RETURN u.favouriteGenres AS favoriteGenres',
            { userId }
        );

        if (result.records.length > 0) {
            const favoriteGenres = result.records[0].get('favoriteGenres');
            return favoriteGenres; // This should return an array of genre IDs
        } else {
            return []; // Return an empty array if no favorite genres are found
        }
    } catch (error) {
        console.error('Error fetching user favorite genres:', error);
        throw new Error('Failed to retrieve favorite genres');
    } finally {
        await session.close();
    }
};

// New function to get user interaction data (watched movies, liked movies, etc.)
const getUserInteractionData = async (userId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u:User {uid: $userId})-[:REVIEW]->(m:Movie) RETURN m.movieId AS movieId, m.rating AS rating',
            { userId }
        );

        return result.records.map(record => ({
            movieId: record.get('movieId'),
            rating: record.get('rating') || null
        }));
    } catch (error) {
        console.error('Error fetching user interaction data:', error);
        throw new Error('Failed to retrieve user interactions');
    } finally {
        await session.close();
    }
};

const closeNeo4jConnection = async () => {
    await driver.close();
};

const checkAndSetupIndex = async () => {
    // await setupIndex();
    // await indexMovies(); // Ensure movies are indexed after setup
};
const genresMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

// Modified recommendation function to leverage collaborative filtering with similarity scaling
const recommendMoviesByTMDBId = async (tmdbId, userId) => {
    try {
        await checkAndSetupIndex();

        const tmdbMovie = await getMovieDetails(tmdbId);
        const userFavoriteGenres = await getUserFavoriteGenres(userId);
        const userInteractions = await getUserInteractionData(userId); // Get watched/liked movies

        // Collect genre IDs for querying
        const genreQuery = [
            ...tmdbMovie.genres.map(genre => genresMap[genre.id]), // Convert TMDB movie genres to names
            ...userFavoriteGenres.map(genreId => genresMap[genreId]) // Convert favorite genre IDs to names
        ].filter(Boolean); // Ensure no undefined values if an ID doesn't exist in the map

        console.log("Searching movies in Elasticsearch with genre query:", genreQuery);

        let { body } = await client.search({
            index: 'movies',
            body: {
                query: {
                    bool: {
                        should: [
                            { match: { overview: tmdbMovie.overview } },
                            { terms: { 'genre_names': genreQuery } }
                        ],
                        must_not: [
                            { match: { id: tmdbId } }
                        ],
                        minimum_should_match: 1
                    }
                },
                size: 400
            },
        });

        let allMovies = body.hits.hits.map(hit => hit._source);

        // Ensure we have enough movies to recommend at least 5
        if (allMovies.length < 5) {
            const additionalMovies = await client.search({
                index: 'movies',
                body: {
                    query: {
                        match_all: {} // Remove popularity condition and fetch all movies
                    }
                },
                size: 100
            });

            allMovies = [...allMovies, ...additionalMovies.body.hits.hits.map(hit => hit._source)];
        }

        allMovies = allMovies.filter(movie => movie.id !== tmdbId);

        // Combine the features of the input movie and all other movies
        const tmdbMovieFeatures = combineFeatures(tmdbMovie);
        const allMoviesFeatures = allMovies.map(combineFeatures);
        const combinedFeatures = [tmdbMovieFeatures, ...allMoviesFeatures];

        // Vectorize the movie features
        const movieVectors = vectorizeMovies(combinedFeatures);
        const [tmdbMovieVector, ...allMoviesVectors] = movieVectors;

        // Calculate cosine similarity for each movie
        const cosineSimilarities = allMoviesVectors.map((vector, index) => {
            const similarity = cosineSimilarity(tmdbMovieVector, vector);

            return {
                movie: allMovies[index],
                similarity: isNaN(similarity) ? 0 : similarity // Handle NaN cases
            };
        });

        // Collaborative filtering: Give a boost to movies that the user has liked or watched
        const enhancedSimilarities = cosineSimilarities.map(rec => {
            const userInteraction = userInteractions.find(interaction => interaction.movieId === rec.movie.id);
            if (userInteraction) {
                rec.similarity += 0.1 * (userInteraction.rating || 1); // Boost based on rating
            }
            return rec;
        });

        // Normalize the similarity scores based on the number of movies to recommend
        const numRecommendations = 15;
        const maxSimilarity = Math.max(...enhancedSimilarities.map(rec => rec.similarity)); // Get max similarity for scaling

        const scaledSimilarities = enhancedSimilarities.map(rec => {
            rec.similarity = (rec.similarity / maxSimilarity) * (1 / numRecommendations); // Scale similarity
            return rec;
        });

        // Sort the movies by similarity in descending order
        scaledSimilarities.sort((a, b) => b.similarity - a.similarity);

        // Return the top 15 highest similarity movies
        const topRecommendations = scaledSimilarities
            .slice(0, numRecommendations)
            .map(rec => ({
                id: rec.movie.id,
                title: rec.movie.title,
                posterUrl: `https://image.tmdb.org/t/p/w500${rec.movie.poster_path}`,
                similarity: (((rec.similarity * 100).toFixed(2)*10).toFixed(2)) // Adjust similarity scaling for display
            }));

        console.log("Top recommendations: ", topRecommendations);
        return topRecommendations;
    } catch (error) {
        console.error('Failed to recommend movies:', error);
        throw new Error('Failed to recommend movies: ' + error.message);
    }
};


const combineFeatures = (movie) => {
    const genres = Array.isArray(movie.genres) ? movie.genres.map(genre => genre.name).join(' ') : '';
    const overview = movie.overview || '';
    const title = movie.title || '';
    const director = movie.director || '';
    // const cast = Array.isArray(movie.cast) ? movie.cast.join(' ') : '';
    // const music = movie.music || '';

    return `${overview} ${genres} ${title} ${director}`.trim();
};

module.exports = { recommendMoviesByTMDBId };
