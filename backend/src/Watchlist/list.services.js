// backend/src/Watchlist/list.services.js
const neo4j = require('neo4j-driver');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const TmdbService = require('../services/tmdb.service');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.createWatchlist = async (userId, watchlistData) => {
    const session = driver.session();
    const watchlistId = uuidv4();
    const { name, tags, visibility, ranked, description, collaborative } = watchlistData;

    try {
        const result = await session.run(
            `CREATE (w:Watchlist {id: $watchlistId, name: $name, tags: $tags, visibility: $visibility, ranked: $ranked, description: $description, collaborative: $collaborative})
             WITH w
             MATCH (u:User {id: $userId})
             CREATE (u)-[:HAS_WATCHLIST]->(w)
             RETURN w`,
            { watchlistId, name, tags, visibility, ranked, description, collaborative, userId }
        );

        const watchlist = result.records[0].get('w').properties;
        return watchlist;
    } finally {
        await session.close();
    }
};

exports.addMovieToWatchlist = async (watchlistId, movieId) => {
    const session = driver.session();

    try {
        const movie = await TmdbService.getMovieDetails(movieId);

        const result = await session.run(
            `MATCH (w:Watchlist {id: $watchlistId})
             CREATE (m:Movie {id: $movieId, title: $title, overview: $overview, releaseDate: $releaseDate, posterPath: $posterPath})
             CREATE (w)-[:CONTAINS]->(m)
             RETURN m`,
            {
                watchlistId,
                movieId: movie.id,
                title: movie.title,
                overview: movie.overview,
                releaseDate: movie.release_date,
                posterPath: movie.poster_path
            }
        );

        const addedMovie = result.records[0].get('m').properties;
        return addedMovie;
    } finally {
        await session.close();
    }
};

exports.modifyWatchlist = async (watchlistId, updatedData) => {
    const session = driver.session();
    const { name, tags, visibility, ranked, description, collaborative } = updatedData;

    try {
        const result = await session.run(
            `MATCH (w:Watchlist {id: $watchlistId})
             SET w.name = $name,
                 w.tags = $tags,
                 w.visibility = $visibility,
                 w.ranked = $ranked,
                 w.description = $description,
                 w.collaborative = $collaborative
             RETURN w`,
            { watchlistId, name, tags, visibility, ranked, description, collaborative }
        );

        const watchlist = result.records[0].get('w').properties;
        return watchlist;
    } finally {
        await session.close();
    }
};

exports.deleteWatchlist = async (watchlistId) => {
    const session = driver.session();

    try {
        await session.run(
            `MATCH (w:Watchlist {id: $watchlistId})
             DETACH DELETE w`,
            { watchlistId }
        );
    } finally {
        await session.close();
    }
};
