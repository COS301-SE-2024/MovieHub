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
            'MATCH (u:User {id: $userId}) RETURN u.favorite_genres AS favoriteGenres',
            { userId }
        );

        // Assuming favorite_genres is stored as a list in Neo4j
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

// Don't forget to close the driver when your application is shutting down
const closeNeo4jConnection = async () => {
    await driver.close();
};

const checkAndSetupIndex = async () => {
    //await setupIndex();
    //await indexMovies(); // Ensure movies are indexed after setup
};


const recommendMoviesByTMDBId = async (tmdbId, userId) => {
    try {
        await checkAndSetupIndex();

        const tmdbMovie = await getMovieDetails(tmdbId);
        const userFavoriteGenres = await getUserFavoriteGenres(userId);

        // Collect genre IDs for querying
        const genreQuery = [...tmdbMovie.genres.map(genre => genre.id), ...userFavoriteGenres];

        console.log("Searching movies in Elasticsearch with genre query:", genreQuery);

        let { body } = await client.search({
            index: 'movies',
            body: {
                query: {
                    bool: {
                        should: [
                            { match: { overview: tmdbMovie.overview } },
                            { terms: { 'genre_ids': genreQuery } }
                        ],
                        must_not: [
                            { match: { id: tmdbId } }
                        ],
                        minimum_should_match: 1
                    }
                },
                size: 100
            },
        });

        let allMovies = body.hits.hits.map(hit => hit._source);

        // Ensure we have enough movies to recommend at least 5
        if (allMovies.length < 5) {
            const additionalMovies = await client.search({
                index: 'movies',
                body: {
                    query: {
                        match_all: {}
                    },
                    size: 100
                },
            });

            allMovies = [...allMovies, ...additionalMovies.body.hits.hits.map(hit => hit._source)];
        }

        allMovies = allMovies.filter(movie => movie.id !== tmdbId);

        // Combine the features of the input movie and all other movies
        const tmdbMovieFeatures = combineFeatures(tmdbMovie);
        const allMoviesFeatures = allMovies.map(combineFeatures);
        const combinedFeatures = [tmdbMovieFeatures, ...allMoviesFeatures];

        console.log("Combined features for all movies: ", combinedFeatures);

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

        // Sort the movies by similarity in descending order
        cosineSimilarities.sort((a, b) => b.similarity - a.similarity);

        // Return the top 15 highest similarity movies
        const topRecommendations = cosineSimilarities
            .slice(0, 15)
            .map(rec => ({
                id: rec.movie.id,
                title: rec.movie.title,
                posterUrl: `https://image.tmdb.org/t/p/w500${rec.movie.poster_path}`,
                similarity: (rec.similarity * 100).toFixed(2)
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
    const cast = Array.isArray(movie.cast) ? movie.cast.join(' ') : '';
    const music = movie.music || '';

    // Combine all available features into a single string
    return `${overview} ${genres} ${title} ${director} ${cast} ${music}`.trim();
};

module.exports = { recommendMoviesByTMDBId };
