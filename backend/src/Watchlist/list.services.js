// backend/src/Watchlist/list.services.js
const neo4j = require('neo4j-driver');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.createWatchlist = async (userId, watchlistData) => {
    const session = driver.session();
    const watchlistId = uuidv4();

    try {
        const result = await session.run(
            `CREATE (w:Watchlist {
                id: $watchlistId,
                name: $name,
                tags: $tags,
                visibility: $visibility,
                isRanked: $isRanked,
                description: $description,
                isCollaborative: $isCollaborative
             })
             WITH w
             MATCH (u:User {id: $userId})
             CREATE (u)-[:HAS_WATCHLIST]->(w)
             RETURN w`,
            {
                watchlistId,
                ...watchlistData,
                userId
            }
        );

        const watchlist = result.records[0].get('w').properties;
        return watchlist;
    } finally {
        await session.close();
    }
};

exports.modifyWatchlist = async (watchlistId, updatedData) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (w:Watchlist {id: $watchlistId})
             SET w += $updatedData
             RETURN w`,
            { watchlistId, updatedData }
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

        return { message: 'Watchlist deleted successfully' };
    } finally {
        await session.close();
    }
};

exports.addMovieToWatchlist = async (watchlistId, movieName) => {
    const session = driver.session();
    const movieId = uuidv4();

    try {
        const result = await session.run(
            `MATCH (w:Watchlist {id: $watchlistId})
             CREATE (m:Movie {id: $movieId, name: $movieName})
             CREATE (w)-[:INCLUDES]->(m)
             RETURN m`,
            { watchlistId, movieId, movieName }
        );

        const movie = result.records[0].get('m').properties;
        return movie;
    } finally {
        await session.close();
    }
};
