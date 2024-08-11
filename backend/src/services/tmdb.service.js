//const axios = require('axios');
import axios from 'axios';
require('dotenv').config();

const TMDB_API_KEY = '5cb60bcbd1b573d3c950b827805204a6';
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
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${TMDB_API_KEY}`, {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
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

exports.searchMoviesByActor = async (actorName) => {
    try {
        // Fetch the actor's ID
        const actorResponse = await axios.get(`${TMDB_BASE_URL}/search/person`, {
            params: {
                api_key: TMDB_API_KEY,
                query: actorName,
            },
        });
        if (actorResponse.data.results.length === 0) {
            throw new Error(`Actor "${actorName}" not found`);
        }
        const actorId = actorResponse.data.results[0].id;

        // Fetch movies by the actor's ID
        const moviesResponse = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                with_cast: actorId,
            },
        });
        return moviesResponse.data.results;
    } catch (error) {
        throw new Error('Failed to search movies by actor');
    }
};


exports.searchMoviesByGenre = async (genreName) => {
    try {
        // Fetch the genre ID
        const genreResponse = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        const genre = genreResponse.data.genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
        if (!genre) {
            throw new Error(`Genre "${genreName}" not found`);
        }
        const genreId = genre.id;

        // Fetch movies by the genre ID
        const moviesResponse = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                with_genres: genreId,
            },
        });
        return moviesResponse.data.results;
    } catch (error) {
        throw new Error('Failed to search movies by genre');
    }
};
