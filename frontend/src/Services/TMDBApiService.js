import axios from 'axios';

const API_KEY = '5cb60bcbd1b573d3c950b827805204a6';

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

