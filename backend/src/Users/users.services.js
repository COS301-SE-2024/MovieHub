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
            'MATCH (u:User {uid: $userId}) RETURN u',
            { userId }
        );
        console.log("Letssss see the result " , result);
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
    MATCH (u:User {uid: $userId})
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
            'MATCH (u:User {uid: $userId}) DETACH DELETE u RETURN count(u) as count',
            { userId: userId }
        );
        // console.log(result);
        const count = result.records[0].get('count');
        console.log(count);
        return { success: count > 0 };
    } finally {
        await session.close();
    }
};

//For watchlist
exports.getUserWatchlists = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (u:User {userId: $userId})-[:HAS_WATCHLIST]->(w:Watchlist)
             RETURN w `,
            { userId }
        );

        // Log the query result
        console.log('Query result:', result);

        if (result.records.length === 0) {
            console.warn(`No watchlists found for userId: ${userId}`);
            return [];
        }

        const watchlists = result.records.map(record => {
            console.log('Record:', record);
            return record.get('w').properties;
        });

        console.log('Watchlists:', watchlists);
        return watchlists;
    } finally {
        await session.close();
    }
};

exports.createUserNode = async (uid, username) => {
    const session = driver.session();
    try {
        // Check if the username already exists
        const checkUsernameResult = await session.run(
            'MATCH (u:User {username: $username}) RETURN u',
            { username }
        );

        if (checkUsernameResult.records.length > 0) {
            // Username already exists
            throw new Error('Username already exists');
        }

        // Create the new user node
        const createUserResult = await session.run(
            'CREATE (u:User {uid: $uid, username: $username}) RETURN u',
            { uid, username }
        );

        return createUserResult.records[0].get('u');
    } catch (error) {
        throw error;
    } finally {
        await session.close();
    }
};



// Close the driver when the application exits
process.on('exit', async () => {
    await driver.close();
});
