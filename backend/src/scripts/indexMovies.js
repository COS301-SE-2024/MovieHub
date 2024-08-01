// backend/src/scripts/indexMovies.js
const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ node: 'http://localhost:9200' });
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const fetchMovies = async () => {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
            api_key: TMDB_API_KEY,
        },
    });
    return response.data.results;
};

const indexMovies = async () => {
    const movies = await fetchMovies();
    const bulkOps = movies.flatMap(movie => [
        { index: { _index: 'movies', _id: movie.id } },
        {
            title: movie.title,
            overview: movie.overview,
            genres: movie.genre_ids.map(id => genresMap[id]).join(' '), // Convert genre IDs to names
            genre_ids: movie.genre_ids,
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
