const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

exports.getPopularMovies = async () => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        return response.data.results;
    } catch (error) {
        throw new Error('Failed to fetch popular movies');
    }
};

exports.searchMovies = async (query) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query: query,
            },
        });
        return response.data.results;
    } catch (error) {
        throw new Error('Failed to search movies');
    }
};

exports.getMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch movie details');
    }
};

exports.fetchMovieDetails = async (movieTitle) => {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
            api_key: TMDB_API_KEY,
            query: movieTitle
        }
    });

    if (response.data.results.length > 0) {
        return response.data.results[0]; // Return the first matching movie
    } else {
        throw new Error(`Movie "${movieTitle}" not found`);
    }
};