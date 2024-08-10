import axios from 'axios';
//require('dotenv').config();


//const API_KEY = process.env.TMDB_API_KEY; //Enter key from .env
const API_KEY = '';


const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/movie/popular`, {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: 1
                }
            });


            return response.data.results;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            throw error;
        }
    };

export const getMovieCredits = async (movieId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching movie credits:', error);
            return { cast: [], crew: [] };
        }
    };


export const getMoviesByGenre = async (genreId) => {
        try {
            const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
            return [];
        }
    };

export const searchMovies = async (query) => {
        try {
            const response = await axios.get(`${BASE_URL}/search/movie`, {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    query: query,
                    page: 1
                }
            });
            return response.data.results;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    };

// Function to get movie details by ID
export const getMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: API_KEY,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null; // Return null or handle the error as needed
    }
};