import axios from 'axios';
//require('dotenv').config();


//const API_KEY = process.env.TMDB_API_KEY; //Enter key from .env
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

    export const getMovieRuntime = async (movieId) => {
        try {
          const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: {
              api_key: API_KEY
            }
          });
          
          const movieDetails = response.data;
          const runtime = movieDetails.runtime;
          
          return runtime;
        } catch (error) {
          console.error('Error fetching movie runtime:', error);
          return null;
        }
      };




    export const getMoviesByGenre = async (genreId, sortBy = 'popularity.desc', page = 1) => {
        try {
            const response = await axios.get(`${BASE_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    with_genres: genreId,
                    sort_by: sortBy,
                    page: page,
                }
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
            return [];
        }
    };


    export const getNewMovies = async (genreId) => {
        try {
            // const today = new Date().toISOString().split('T')[0];
            const response = await axios.get(`${BASE_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    with_genres: genreId,
                    // primary_release_date_gte: today,
                    sort_by : 'revenue.desc',
                    page: 1,
                }
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching new movies:', error);
            return [];
        }
    };
    
    export const getTopPicksForToday = async (genreId) => {
        try {
            const response = await axios.get(`${BASE_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    with_genres: genreId,
                    sort_by: 'vote_average.desc',
                    page: 1,
                    'vote_count.gte' : 10000
                }
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching top picks for today:', error);
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

    const getClassicMovies = async () => {
        try {
            const movies = await getMoviesByGenre(genreId);
    
            // Example criteria for "classic" movies
            const classicMovies = movies.filter(movie => {
                // Check if the movie meets criteria for being a classic
                return movie.vote_average >= 8.0 && movie.popularity >= 100;
            });
    
            console.log('Classic Movies:', classicMovies);
        } catch (error) {
            console.error('Error fetching classic movies:', error);
        }
    }; 

