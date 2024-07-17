const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);


exports.actorExist =  async (actorName) => {
    const session = driver.session();
    console.log("actorExist", actorName);

    try {
        const result = await session.run(
            `MATCH (a:Actor {name: $actorName}) RETURN a`,
            { actorName }
        );
        return result.records.length > 0;
        
    } catch (error) {
        console.error('Error checking actor existence:', error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.addActor = async (actorName) => {
    const session = driver.session();
    console.log("addActor", actorName);

    try {
        const result = await session.run(
            `CREATE (a:Actor {name: $actorName})`,
            { actorName }
        );
        console.log("Actor created successfully: ", actorName);
    } catch (error) {
        console.error('Error adding actor:', error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.addMovieToActor = async (actorName, movieId) => {
    const session = driver.session();
    console.log("addMovieToActor", actorName, movieId);

    try {
        const result = await session.run(
            `MATCH (a:Actor {name: $actorName}), (m:Movie {movieId: $movieId})
             CREATE (a)-[:ACTED_IN]->(m)`,
            { actorName, movieId }
        );
        console.log("Movie added to actor successfully: ", actorName);
    } catch (error) {
        console.error('Error adding movie to actor:', error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getMoviesByActor = async (actorName) => {
    const session = driver.session();
    console.log("getMoviesByActor", actorName);

    try {
        const result = await session.run(
            `MATCH (a:Actor {name: $actorName})-[:ACTED_IN]->(m:Movie) RETURN m`,
            { actorName }
        );
        return result.records.map(record => record._fields[0].properties);
        
    } catch (error) {
        console.error('Error getting movies by actor:', error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getActorsByMovie = async (movieId) => {
    const session = driver.session();
    console.log("getActorsByMovie", movieId);
    
    try{
        const result = await session.run(
            `MATCH (m:Movie {movieId: $movieId})-[:ACTED_IN]->(a:Actor) RETURN a`,
            { movieId }
        );
        return result.records.map(record => record._fields[0].properties);
    }
    catch (error) {
        console.error('Error getting actors by movie:', error);
        throw error;
    } finally {
        await session.close();
    }
};

