// backend/users/users.services.js
const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.getUserProfile = async (userId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u:User {userId: $userId}) RETURN u',
            { userId }
        );
        if (result.records.length === 0) {
            return null;
        }
        return result.records[0].get('u').properties;
        // } catch (error) {
        //     throw error;
    } finally {
        await session.close();
    }
};

exports.updateUserProfile = async (userId, updates) => {
    const session = driver.session();
    const query = `
    MATCH (u:User {userId: $userId})
    SET u += $updates
    RETURN u
  `;
    try {
        const result = await session.run(query, { userId, updates });
        if (result.records.length === 0) {
            return null;
        }
        return result.records[0].get('u').properties;
    } catch (error) {
        throw error;
    } finally {
        await session.close();
    }
};

exports.deleteUserProfile = async (userId) => {
    const session = driver.session();
    console.log("Inside services")
    try {
    
        const result = await session.run(
            'MATCH (u:User {userId: $userId}) DETACH DELETE u RETURN count(u) as count',
            { userId: userId }
        );
       // console.log(result);
        const count = result.records[0].get('count');
        console.log(count);
        return count > 0;
    } finally {
        await session.close();
    }
};

// Close the driver when the application exits
process.on('exit', async () => {
    await driver.close();
});
