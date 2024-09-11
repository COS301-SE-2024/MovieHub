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

        let { body } = await client.search({
            index: 'movies',
            body: {
                query: {
                    bool: {
                        should: [
                            { match: { overview: tmdbMovie.overview } }, // Prioritize matching overview
                            { terms: { 'genre_ids': genreQuery } } // Consider genres as well
                        ],
                        minimum_should_match: 1
                    }
                },
                size: 100 // Retrieve up to 100 movies for comparison
            },
        }).catch(error => {
            console.error('Error during Elasticsearch search:', error);
            throw error;
        });

        console.log("Awaited client...");
        let allMovies = body.hits.hits.map(hit => hit._source);

        // Ensure we have enough movies to recommend at least 5
        if (allMovies.length < 5) {
            // If fewer than 5 movies are found, broaden the search criteria
            const additionalMovies = await client.search({
                index: 'movies',
                body: {
                    query: {
                        match_all: {} // Match all movies to ensure at least 5 are returned
                    },
                    size: 100
                },
            });

            allMovies = [...allMovies, ...additionalMovies.body.hits.hits.map(hit => hit._source)];
        }

        // Combine the features of the input movie and all other movies
        const tmdbMovieFeatures = combineFeatures(tmdbMovie);
        const allMoviesFeatures = allMovies.map(combineFeatures);
        const combinedFeatures = [tmdbMovieFeatures, ...allMoviesFeatures];

        console.log("The combined features: ", combinedFeatures);

        // Vectorize the movie features
        const movieVectors = vectorizeMovies(combinedFeatures);
        const [tmdbMovieVector, ...allMoviesVectors] = movieVectors;

        console.log("Movie Vectors: ", movieVectors);

        // Calculate cosine similarity for each movie and sort by relevance
        const cosineSimilarities = allMoviesVectors.map((vector, index) => ({
            movie: allMovies[index],
            similarity: cosineSimilarity(tmdbMovieVector, vector)
        }));

        // Sort the movies by similarity in descending order (most relevant first)
        cosineSimilarities.sort((a, b) => b.similarity - a.similarity);
        console.log("Cosine similarities ", cosineSimilarities);

        // Ensure at least 5 recommendations
        const topRecommendations = cosineSimilarities.slice(0, Math.max(5, cosineSimilarities.length)).map(rec => rec.movie);

        return topRecommendations;
    } catch (error) {
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
    // You might adjust weights if needed by adjusting how features are concatenated or processed
    return `${overview} ${genres} ${title} ${director} ${cast} ${music}`.trim();
};

module.exports = { recommendMoviesByTMDBId };
