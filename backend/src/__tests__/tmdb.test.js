const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { getPopularMovies, searchMovies, getMovieDetails, fetchMovieDetails, searchMoviesByActor, searchMoviesByGenre } = require('../services/tmdb.service');

// Make sure you have your TMDB API key set up correctly
const TMDB_API_KEY = process.env.TMDB_API_KEY;

describe('TMDB API Integration Tests', () => {
    jest.setTimeout(10000); // Increase timeout to handle potential delays in API responses

    it('should fetch popular movies from TMDB', async () => {
        const movies = await getPopularMovies();
        expect(Array.isArray(movies)).toBe(true); // Ensure the result is an array
        expect(movies.length).toBeGreaterThan(0); // Ensure movies are returned
        expect(movies[0]).toHaveProperty('title'); // Check for a title property in the first result
    });

    it('should search for movies by query', async () => {
        const query = 'Inception';
        const movies = await searchMovies(query);
        expect(Array.isArray(movies)).toBe(true);
        expect(movies[0].title).toBe('Inception');
    });

    it('should get details of a specific movie by ID', async () => {
        const movieId = 550; // Movie ID for Fight Club
        const movieDetails = await getMovieDetails(movieId);
        expect(movieDetails).toHaveProperty('id', movieId);
        expect(movieDetails).toHaveProperty('title', 'Fight Club');
    });

    it('should fetch movie details by movie title', async () => {
        const movieTitle = 'The Dark Knight';
        const movie = await fetchMovieDetails(movieTitle);
        expect(movie.title).toBe('The Dark Knight');
    });

    it('should search movies by actor name', async () => {
        const actorName = 'Leonardo DiCaprio';
        const movies = await searchMoviesByActor(actorName);
        expect(Array.isArray(movies)).toBe(true);
        expect(movies.length).toBeGreaterThan(0);
        expect(movies[0]).toHaveProperty('title');
    });

    it('should search movies by genre name', async () => {
        const genreName = 'Action';
        const movies = await searchMoviesByGenre(genreName);
        expect(Array.isArray(movies)).toBe(true);
        expect(movies.length).toBeGreaterThan(0);
        expect(movies[0]).toHaveProperty('title');
    });

    it('should return empty result when searching for non-existing movie', async () => {
        const query = 'SomeNonExistingMovie';
        try {
            const result = await fetchMovieDetails(query);
        } catch (error) {
            expect(error.message).toBe(`Movie "${query}" not found`);
        }
    });
});
