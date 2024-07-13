// backend/src/Watchlist/list.services.js
const neo4j = require('neo4j-driver');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const TmdbService = require('../services/tmdb.service');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// exports.createWatchlist = async (userId, watchlistData) => {
//     console.log("In list.services");
//     const session = driver.session();
//     const watchlistId = uuidv4();
//     const { name, tags, visibility, ranked, description, collaborative } = watchlistData;
   
//     try {
//         console.log("Hiiiiii ")
//         const result = await session.run(
//             `CREATE (w:Watchlist {id: $watchlistId, name: $name, tags: $tags, visibility: $visibility, ranked: $ranked, description: $description, collaborative: $collaborative})
//              WITH w
//              MATCH (u:User {id: $userId})
//              CREATE (u)-[:HAS_WATCHLIST]->(w)
//              RETURN w`,
//             { watchlistId, name, tags, visibility, ranked, description, collaborative, userId }
//         );
//        console.log("Awaited ")
//         const watchlist = result.records[0].get('w').properties;
//         console.log("About to return watchlist "+watchlist);
//         return watchlist;
//     } finally {
//         await session.close();
//     }
// };

exports.createWatchlist = async (userId, watchlistData) => {
    console.log("In list.services");

    // Ensure all required parameters are present
    const requiredParams = ['name', 'tags', 'visibility', 'ranked', 'description', 'collaborative', 'movies'];
    for (const param of requiredParams) {
        if (!(param in watchlistData)) {
            console.error(`Missing required parameter: ${param}`);
            throw new Error(`Expected parameter(s): ${requiredParams.join(', ')}`);
        }
    }

    const session = driver.session();
    const watchlistId = uuidv4();
    const { name, tags, visibility, ranked, description, collaborative, movies } = watchlistData;

    try {
        console.log("All parameters are present. Proceeding with database query.");

        // Start a transaction
        const tx = session.beginTransaction();

        // Fetch movie details from TMDB and create movie nodes if they do not exist
        const movieDetailsPromises = movies.map(async (movieTitle) => {
            const movieDetails = await TmdbService.fetchMovieDetails(movieTitle);
            if (!movieDetails) {
                throw new Error(`Movie not found: ${movieTitle}`);
            }
            await tx.run(
                `MERGE (m:Movie {id: $id, title: $title, releaseDate: $releaseDate, overview: $overview, posterPath: $posterPath})
                 RETURN m`,
                {
                    id: movieDetails.id,
                    title: movieDetails.title,
                    releaseDate: movieDetails.release_date,
                    overview: movieDetails.overview,
                    posterPath: movieDetails.poster_path
                }
            );
            return movieDetails.id;
        });

        const movieIds = await Promise.all(movieDetailsPromises);

        const result = await tx.run(
            `CREATE (w:Watchlist {id: $watchlistId, name: $name, tags: $tags, visibility: $visibility, ranked: $ranked, description: $description, collaborative: $collaborative})
             MERGE (u:User {uid: $userId})
             CREATE (u)-[:HAS_WATCHLIST]->(w)
             RETURN w`,
            { watchlistId, name, tags, visibility, ranked, description, collaborative, userId }
        );

        console.log("Database query executed.");
        if (result.records.length === 0) {
            throw new Error("Failed to create watchlist.");
        }

        // Associate movies with the watchlist
        for (const movieId of movieIds) {
            await tx.run(
                `MATCH (w:Watchlist {id: $watchlistId}), (m:Movie {id: $movieId})
                 CREATE (w)-[:INCLUDES]->(m)`,
                { watchlistId, movieId }
            );
        }

        // Commit the transaction
        await tx.commit();

        console.log("Movies associated with the watchlist.");

        return { id: watchlistId, ...watchlistData };
    } catch (error) {
        console.error("Error creating watchlist:", error);
        if (tx) await tx.rollback();
        throw error;
    } finally {
        await session.close();
    }
};

// exports.addMovieToWatchlist = async (watchlistId, movieId) => {
//     const session = driver.session();

//     try {
//         const movie = await TmdbService.getMovieDetails(movieId);

//         const result = await session.run(
//             `MATCH (w:Watchlist {id: $watchlistId})
//              CREATE (m:Movie {id: $movieId, title: $title, overview: $overview, releaseDate: $releaseDate, posterPath: $posterPath})
//              CREATE (w)-[:CONTAINS]->(m)
//              RETURN m`,
//             {
//                 watchlistId,
//                 movieId: movie.id,
//                 title: movie.title,
//                 overview: movie.overview,
//                 releaseDate: movie.release_date,
//                 posterPath: movie.poster_path
//             }
//         );

//         const addedMovie = result.records[0].get('m').properties;
//         return addedMovie;
//     } finally {
//         await session.close();
//     }
// };

// exports.modifyWatchlist = async (watchlistId, updatedData) => {
//     const session = driver.session();
//     const { name, tags, visibility, ranked, description, collaborative } = updatedData;

//     try {
//         const result = await session.run(
//             `MATCH (w:Watchlist {id: $watchlistId})
//              SET w.name = $name,
//                  w.tags = $tags,
//                  w.visibility = $visibility,
//                  w.ranked = $ranked,
//                  w.description = $description,
//                  w.collaborative = $collaborative
//              RETURN w`,
//             { watchlistId, name, tags, visibility, ranked, description, collaborative }
//         );

//         const watchlist = result.records[0].get('w').properties;
//         return watchlist;
//     } finally {
//         await session.close();
//     }
// };

exports.modifyWatchlist = async (watchlistId, updatedData) => {
    const session = driver.session();

    const updateFields = [];
    const updateValues = { watchlistId };

    // Dynamically create the Cypher SET clause based on provided fields
    Object.keys(updatedData).forEach(key => {
        updateFields.push(`w.${key} = $${key}`);
        updateValues[key] = updatedData[key];
    });

    const setClause = updateFields.join(', ');

    try {
        const result = await session.run(
            `MATCH (w:Watchlist {id: $watchlistId})
             SET ${setClause}
             RETURN w`,
            updateValues
        );

        if (result.records.length === 0) {
            throw new Error('Watchlist not found');
        }
        console.log("Watchlist has been updated successfully");
        const watchlist = result.records[0].get('w').properties;
        return watchlist;
    } catch (error) {
        console.error('Error modifying watchlist:', error);
        throw error;
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

        console.log('Watchlist deleted successfully');
    } finally {
        await session.close();
    }

    
};
