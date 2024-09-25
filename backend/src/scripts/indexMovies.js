const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ node: 'http://localhost:9200' });
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Function to fetch movies from a given TMDB endpoint
const fetchMoviesFromEndpoint = async (endpoint, totalPages = 1) => {
    const allMovies = [];
    for (let page = 1; page <= totalPages; page++) {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${endpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                page: page, // Add page parameter
            },
        });
        allMovies.push(...response.data.results); // Collect all movies
        if (response.data.total_pages && page >= response.data.total_pages) {
            break; // Stop if we've reached the last page
        }
    }
    return allMovies;
};

// Function to fetch popular, top-rated, and upcoming movies
const fetchMovies = async () => {
    const popularMovies = await fetchMoviesFromEndpoint('popular', 20); // Specify how many pages to fetch
    const topRatedMovies = await fetchMoviesFromEndpoint('top_rated', 10);
    const upcomingMovies = await fetchMoviesFromEndpoint('upcoming', 1);
    const trendingMoviesResponse = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
        params: { api_key: TMDB_API_KEY },
    });
    const nowPlayingMovies = await fetchMoviesFromEndpoint('now_playing', 3);

    // Combine all movie lists and remove duplicates by movie ID
    const allMovies = [
        ...popularMovies,
        ...topRatedMovies,
        ...upcomingMovies,
        ...trendingMoviesResponse.data.results,
        ...nowPlayingMovies,
    ];

    // Remove duplicate movies by filtering based on the movie's ID
    const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());

    return uniqueMovies;
};

// Function to delete the index if it exists
const deleteIndexIfExists = async (indexName) => {
    const exists = await client.indices.exists({ index: indexName });
    if (exists.body) {
        await client.indices.delete({ index: indexName });
        console.log(`Deleted existing index: ${indexName}`);
    }
};

const indexMovies = async () => {
    const indexName = 'movies';

    // Delete the index if it exists
    await deleteIndexIfExists(indexName);

    // Create a new index
    await client.indices.create({
        index: indexName,
        body: {
            mappings: {
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'text' },
                    overview: { type: 'text' },
                    genres: { type: 'text' },
                    genre_ids: { type: 'integer' },
                    poster_path: { type: 'text' }
                }
            }
        }
    });

    // Fetch movies and index them
    const movies = await fetchMovies();
    const bulkOps = movies.flatMap(movie => [
        { index: { _index: indexName, _id: movie.id } },
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
    await client.indices.refresh({ index: indexName });
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
