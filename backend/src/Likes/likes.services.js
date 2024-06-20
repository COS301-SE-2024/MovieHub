const neo4j = require('neo4j-driver');
// require('dotenv').config();
const driver = neo4j.driver(
    'neo4j+s://d16778b5.databases.neo4j.io',
    neo4j.auth.basic('neo4j', '1yDboUOlGobuDEJX6xw_JitPl-93pTFKN6iYJCyyvt0')
);

async function toggleLike(userId, entityId, entityType) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u), (e)
            WHERE ID(u) = $userId AND ID(e) = $entityId
            MATCH (u)-[like:LIKES]->(e)
            RETURN like`,
            { userId, entityId }
            // `MATCH (u:User {id: $userId})
            //  WITH u
            //  MATCH (u)-[like:LIKES]->(e:${entityType} {id: $entityId})
            //  RETURN like`,

            // `MATCH (u:User {id: $userId})-[like:LIKES]->(${entityType} {id: $entityId}) ` +
            // 'RETURN like',
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u), (e)
                WHERE ID(u) = $userId AND ID(e) = $entityId
                MATCH (u)-[like:LIKES]->(e)
                DETACH DELETE like`,
                { userId, entityId }
                // `MATCH (u:User {id: $userId})
                //  WITH u
                //  MATCH (u)-[like:LIKES]->(e:${entityType} {id: $entityId})
                //  DETACH DELETE like`,

                // `MATCH (u:User {id: $userId})-[like:LIKES]->(${entityType} {id: $entityId}) ` +
                // 'DELETE like',
            );
            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u), (e)
                WHERE ID(u) = $userId AND ID(e) = $entityId
                MERGE (u)-[:LIKES]->(e)`,
                // `MATCH (u:User {id: $userId}), (${entityType} {id: $entityId}) ` +
                // `MERGE (u)-[:LIKES]->(${entityType})`,
                { userId, entityId }
            );
            return true; // Entity liked
        }
    } catch (error) {
        console.error(`Error toggling like on ${entityType.toLowerCase()}:`, error);
        throw new Error(`An error occurred while toggling like on the ${entityType.toLowerCase()}`);
    } finally {
        await session.close();
    }
}

async function toggleLikeReview(userId, reviewId) {
    return toggleLike(userId, reviewId, 'Review');
}

async function toggleLikeComment(userId, commentId) {
    return toggleLike(userId, commentId, 'Comment');
}

async function toggleLikeMovie(userId, movieId) {
    return toggleLike(userId, movieId, 'Movie');
}

process.on('exit', () => {
    driver.close();
});

module.exports = { toggleLikeReview, toggleLikeComment, toggleLikeMovie };
