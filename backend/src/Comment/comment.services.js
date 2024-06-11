const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.addComment = async (userId, movieId, text, parentCommentId = null) => {
    const session = driver.session();
    try {
        let result;
        if (parentCommentId) {
            result = await session.run(
                `MATCH (u:User {id: $userId}), (c:Comment {id: $parentCommentId})
                 CREATE (u)-[:COMMENTED]->(newComment:Comment {id: randomUUID(), text: $text, createdAt: datetime()})
                 CREATE (c)-[:COMMENTED_ON]->(newComment)
                 RETURN newComment`,
                { userId, parentCommentId, text }
            );
        } else {
            result = await session.run(
                `MATCH (u:User {id: $userId}), (m:Movie {id: $movieId})
                 CREATE (u)-[:COMMENTED]->(newComment:Comment {id: randomUUID(), text: $text, createdAt: datetime()})
                 CREATE (m)-[:COMMENTED_ON]->(newComment)
                 RETURN newComment`,
                { userId, movieId, text }
            );
        }
        return result.records[0].get('newComment').properties;
    } finally {
        await session.close();
    }
};

exports.editComment = async (commentId, newText) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {id: $commentId})
             SET c.text = $newText, c.updatedAt = datetime()
             RETURN c`,
            { commentId, newText }
        );
        return result.records[0].get('c').properties;
    } finally {
        await session.close();
    }
};

exports.removeComment = async (commentId) => {
    const session = driver.session();
    try {
        await session.run(
            `MATCH (c:Comment {id: $commentId})
             DETACH DELETE c`,
            { commentId }
        );
        return true;
    } finally {
        await session.close();
    }
};

exports.toggleLikeComment = async (userId, commentId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId}), (c:Comment {id: $commentId})
             OPTIONAL MATCH (u)-[l:LIKED]->(c)
             WITH u, c, l
             CALL apoc.do.when(
               l IS NULL,
               'CREATE (u)-[:LIKED]->(c) RETURN true',
               'DELETE l RETURN false',
               {u: u, c: c, l: l}
             ) YIELD value
             RETURN value`
            , { userId, commentId }
        );
        return result.records[0].get('value');
    } finally {
        await session.close();
    }
};
