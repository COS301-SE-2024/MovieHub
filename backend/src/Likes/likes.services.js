const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

async function toggleLikeReview(userId, reviewId) {
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u:User {id: $userId})-[like:LIKES]->(r:Review {id: $reviewId}) ' +
            'RETURN like',
            { userId, reviewId }
        );

        if (result.records.length > 0) {
            await session.run(
                'MATCH (u:User {id: $userId})-[like:LIKES]->(r:Review {id: $reviewId}) ' +
                'DELETE like',
                { userId, reviewId }
            );
            return false; // Like removed
        } else {
            await session.run(
                'MATCH (u:User {id: $userId}), (r:Review {id: $reviewId}) ' +
                'MERGE (u)-[:LIKES]->(r)',
                { userId, reviewId }
            );
            return true; // Review liked
        }
    } catch (error) {
        console.error('Error toggling like on review:', error);
        throw new Error('An error occurred while toggling like on the review');
    } finally {
        await session.close();
    }
}

process.on('exit', () => {
    driver.close();
});

module.exports = { toggleLikeReview };
