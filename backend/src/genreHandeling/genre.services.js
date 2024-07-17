const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.genreExist = async (genre) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (g:Genre {name: $genre})
            RETURN g
            `,
            { genre }
        );
        return result.records.length > 0;
    } finally {
        await session.close();
    }
};


exports.addGenre = async (genre) => {
    const session = driver.session();

    try {
        await session.run(
            `
            CREATE (g:Genre {name: $genre})
            RETURN g
            `,
            { genre }
        );
        return true;
    } finally {
        await session.close();
    }
};


exports.getGenres = async () => {
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (g:Genre)
            RETURN g.name as genre
            `,
        );
        return result.records.map((record) => record.get('genre'));
    } finally {
        await session.close();
    }
};

exports.addGenreToMovie = async (genre) => {
    const session = driver.session();

    try {
        await session.run(
            `
            MATCH (g:Genre {name: $genre}), (m:Movie)
            CREATE (g)-[:IN_GENRE]->(m)
            RETURN g.name as genre
            `,
            { genre }
        );
        return true;
    } finally {
        await session.close();
    }
};

exports.getMoviesByGenre = async (genre) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (g:Genre {name: $genre})-[:IN_GENRE]->(m:Movie)
            RETURN m.title as movie
            `,
            { genre }
        );
        return result.records.map((record) => record.get('movie'));
    } finally {
        await session.close();
    }
};


        
