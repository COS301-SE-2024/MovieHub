// backend/src/recommender/recommender.service.js
const { Client } = require('@elastic/elasticsearch');
const { getMovieDetails } = require('../services/tmdb.service');
const vectorizeMovies = require('../utils/vectorizeMovies');
const cosineSimilarity = require('compute-cosine-similarity');
const setupIndex = require('../scripts/setupElastic');
const indexMovies = require('../scripts/indexMovies');

const client = new Client({ node: 'http://localhost:9200' });

const checkAndSetupIndex = async () => {
    await setupIndex();
    await indexMovies(); // Ensure movies are indexed after setup
};

const recommendMoviesByTMDBId = async (tmdbId) => {
    try {
        await checkAndSetupIndex();

        const tmdbMovie = await getMovieDetails(tmdbId);
        const genreQuery = tmdbMovie.genres.map(genre => genre.id);
        console.log("About to make use of Elasticsearch client");

        const { body } = await client.search({
            index: 'movies',
            body: {
                query: {
                    terms: { 'genre_ids': genreQuery },
                },
                size: 100 // Adjust size as needed
            },
        }).catch(error => {
            console.error('Error during Elasticsearch search:', error);
            throw error;
        });

        console.log("Awaited client...");
        const allMovies = body.hits.hits.map(hit => hit._source);
        const tmdbMovieFeatures = combineFeatures(tmdbMovie);
        const allMoviesFeatures = allMovies.map(combineFeatures);
        const combinedFeatures = [tmdbMovieFeatures, ...allMoviesFeatures];
        console.log("The combined features: ", combinedFeatures);

        const movieVectors = vectorizeMovies(combinedFeatures);
        const [tmdbMovieVector, ...allMoviesVectors] = movieVectors;
        console.log("Movie Vectors: ", movieVectors);

        const cosineSimilarities = allMoviesVectors.map((vector, index) => ({
            movie: allMovies[index],
            similarity: cosineSimilarity(tmdbMovieVector, vector)
        }));

        cosineSimilarities.sort((a, b) => b.similarity - a.similarity);

        const topRecommendations = cosineSimilarities.slice(0, 10).map(rec => rec.movie);
        return topRecommendations;
    } catch (error) {
        throw new Error('Failed to recommend movies: ' + error.message);
    }
};

const combineFeatures = (movie) => {
    const genres = movie.genres ? movie.genres.join(' ') : '';
    const overview = movie.overview ? movie.overview : '';
    return `${genres} ${overview}`.trim();
};

module.exports = { recommendMoviesByTMDBId };
