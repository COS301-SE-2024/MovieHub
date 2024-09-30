const neo4j = require('neo4j-driver');
require("dotenv").config();


const updateUserProperties = async (uid, points, level, position) => {
    const session = driver.session();
    const query = `
        MATCH (u:User {uid: $uid})
        SET u += {
            points: $points,
            level: $level,
            position: $position
        }
        RETURN u
    `;

    try {
        const result = await session.run(query, {
            uid,
            points,
            level,
            position
        });
        return result.records[0].get('u').properties;
    } catch (error) {
        console.error('Error updating user properties:', error);
        throw error;
    } finally {
        await session.close();
    }
};

module.exports = {
    updateUserProperties,

};

exports.getUserGameProfile = async (userId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            "MATCH (u:User {uid: $userId}) RETURN u.uid AS uid, u.username AS username, u.points AS points, u.level AS level, u.position AS position", 
            { userId }
        );

        if (result.records.length === 0) {
            return null;
        }

        // Extract uid, username, points, level, and position from the result
        const profileGot = {
            uid: result.records[0].get('uid'),
            username: result.records[0].get('username'),
            points: result.records[0].get('points') || 0, // Default to 0 if points is not set
            level: result.records[0].get('level') || "Beginner", // Default to "Beginner" if level is not set
            position: result.records[0].get('position') !== null ? parseInt(result.records[0].get('position')) : 0 // Default to 0 if position is not set
        };

        return profileGot;
    } finally {
        await session.close();
    }
};
