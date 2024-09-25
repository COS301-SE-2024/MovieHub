// backend/src/scripts/indexMovies.js
const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ node: 'http://localhost:9200' });
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Function to fetch movies from a given TMDB endpoint
const fetchMoviesFromEndpoint = async (endpoint) => {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${endpoint}`, {
        params: {
            api_key: TMDB_API_KEY,
        },
    });
    return response.data.results;
};

// Function to fetch popular, top-rated, and upcoming movies
const fetchMovies = async () => {
    const popularMovies = await fetchMoviesFromEndpoint('popular');
    const topRatedMovies = await fetchMoviesFromEndpoint('top_rated');
    const upcomingMovies = await fetchMoviesFromEndpoint('upcoming');
    const trendingMovies = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
        params: { api_key: TMDB_API_KEY },
    });

    // Combine all movie lists and remove duplicates by movie ID
    const allMovies = [
        ...popularMovies,
        ...topRatedMovies,
        ...upcomingMovies,
        ...trendingMovies.data.results,
    ];

    // Remove duplicate movies by filtering based on the movie's ID
    const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());

    return uniqueMovies;
};

const indexMovies = async () => {
    const movies = await fetchMovies();
    const bulkOps = movies.flatMap(movie => [
        { index: { _index: 'movies', _id: movie.id } },
        {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            genres: movie.genre_ids.map(id => genresMap[id]).join(' '), // Convert genre IDs to names
            genre_ids: movie.genre_ids,
            poster_path: movie.poster_path, // Ensure poster_path is included
        }
    ]);

    await client.bulk({ body: bulkOps });
    await client.indices.refresh({ index: 'movies' });
};

const genresMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

module.exports = indexMovies;
