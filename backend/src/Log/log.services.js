const { v4: uuidv4 } = require('uuid');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const checkUserAndMovieExist = async (uid, movieId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (m:Movie {movieId: $movieId})
             RETURN u, m`,
            { uid, movieId }
        );
        if (result.records.length === 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error checking user and movie existence: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.addLog = async (uid, movieId, date) => {
    console.log("In Services: addLog");
    const session = driver.session();
    try {
        if (!(await checkUserAndMovieExist(uid, movieId))) {
            throw new Error("User or Movie not found");
        }
        
        const logId = uuidv4();
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (m:Movie {movieId: $movieId})
             CREATE (l:Log {logId: $logId, date: $date, uid: $uid, movieId: $movieId})
             CREATE (u)-[:LOGGED]->(l)-[:LOGGED_ON]->(m)
             RETURN l`,
            { uid, movieId, date, logId }
        );
        console.log("The Result: ", result.summary);
        return result.records[0].get('l').properties;
    } catch (error) {
        console.error("Error adding log: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.editLog = async (uid, movieId, date, desc) => {
    console.log("In Services: editLog");
    const session = driver.session();
    try {
        if (!(await checkUserAndMovieExist(uid, movieId))) {
            throw new Error("User or Movie not found");
        }

        const result = await session.run(
            `MATCH (l:Log {uid: $uid, movieId: $movieId})
             SET l.date = $date, l.desc = $desc, l.updatedAt = timestamp()
             RETURN l`,
            { uid, movieId, date, desc }
        );
        console.log("The Result: ", result.summary);
        return result.records[0].get('l').properties;
    } catch (error) {
        console.error("Error editing log: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.removeLog = async (uid, movieId, date, desc) => {
    console.log("In Services: removeLog");
    const session = driver.session();
    try {
        if (!(await checkUserAndMovieExist(uid, movieId))) {
            throw new Error("User or Movie not found");
        }

        const result = await session.run(
            `MATCH (l:Log {uid: $uid, movieId: $movieId, date: $date, desc: $desc})
             DETACH DELETE l
             RETURN COUNT(l) AS removed`,
            { uid, movieId, date, desc }
        );
        console.log("The Result: ", result.summary);
        return result.records[0].get('removed').low > 0;
    } catch (error) {
        console.error("Error removing log: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getLogsOfUser = async (uid) => {
    console.log("In Services: getLogsOfUser");
    const session = driver.session();
    try {
        const userExists = await session.run(
            `MATCH (u:User {uid: $uid})
             RETURN u`,
            { uid }
        );

        if (userExists.records.length === 0) {
            throw new Error("User not found");
        }

        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:LOGGED]->(l:Log)
             RETURN l`,
            { uid }
        );
        console.log("The Result: ", result.summary);
        return result.records.map(record => record.get('l').properties);
    } catch (error) {
        console.error("Error fetching logs: ", error);
        throw error;
    } finally {
        await session.close();
    }
};
