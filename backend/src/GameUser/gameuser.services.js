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
