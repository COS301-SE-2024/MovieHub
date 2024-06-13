const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

async function toggleLike(userId, entityId, entityType) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId})-[like:LIKES]->(${entityType} {id: $entityId}) ` +
            'RETURN like',
            { userId, entityId }
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u:User {id: $userId})-[like:LIKES]->(${entityType} {id: $entityId}) ` +
                'DELETE like',
                { userId, entityId }
            );
            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u:User {id: $userId}), (${entityType} {id: $entityId}) ` +
                `MERGE (u)-[:LIKES]->(${entityType})`,
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
