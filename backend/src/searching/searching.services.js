const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');
require('dotenv').config();

const esClient = new Client({ node: 'http://localhost:9200' });
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const indexMovieData = async () => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });

        const movies = response.data.results;

        for (let movie of movies) {
            await esClient.index({
                index: 'movies',
                body: {
                    title: movie.title,
                    overview: movie.overview,
                    release_date: movie.release_date,
                    quotes: [],  // Add quotes if available
                    keywords: []  // Add keywords if available
                }
            });
        }

        await esClient.indices.refresh({ index: 'movies' });
        console.log('Movies indexed successfully');
    } catch (error) {
        console.error('Error indexing movies:', error);
    }
};

indexMovieData();


exports.searchMoviesByQuoteOrKeyword = async (query) => {
    try {
        const response = await esClient.search({
            index: 'movies',
            body: {
                query: {
                    multi_match: {
                        query: query,
                        fields: ['title', 'overview', 'quotes', 'keywords'],
                        fuzziness: 'AUTO'
                    }
                }
            }
        });

        return response.hits.hits.map(hit => hit._source);
    } catch (error) {
        throw new Error('Failed to search movies by quote or keyword');
    }
};

const { searchMoviesByQuoteOrKeyword } = require('./path-to-your-file');

// Search movies by quote or keyword
searchMoviesByQuoteOrKeyword('famous quote or keyword').then(movies => {
    console.log('Movies found:', movies);
}).catch(error => {
    console.error(error.message);
});
