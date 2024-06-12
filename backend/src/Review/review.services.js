const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.addReview = async (userId, movieId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId}), (m:Movie {id: $movieId})
             CREATE (u)-[:REVIEWER]->(newReview:Review {id: randomUUID(), text: $text, createdAt: datetime()})
             CREATE (m)-[:REVIEWED]->(newReview)
             RETURN newReview`,
            { userId, movieId, text }
        );
        return result.records[0].get('newReview').properties;
    } finally {
        await session.close();
    }
};

exports.addCommentToReview = async (userId, reviewId, movieId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId}), (r:Review {id: $reviewId}), (m:Movie {id: $movieId})
             CREATE (u)-[:COMMENTED_BY]->(newComment:Comment {id: randomUUID(), text: $text, createdAt: datetime(), movieId: $movieId})
             CREATE (r)-[:COMMENTED_ON]->(newComment)
             RETURN newComment`,
            { userId, reviewId, movieId, text }
        );
        return result.records[0].get('newComment').properties;
    } finally {
        await session.close();
    }
};

exports.addCommentToComment = async (userId, commentId, movieId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId}), (c:Comment {id: $commentId}), (m:Movie {id: $movieId})
             CREATE (u)-[:COMMENTED_BY]->(newComment:Comment {id: randomUUID(), text: $text, createdAt: datetime(), movieId: $movieId})
             CREATE (c)-[:COMMENTED_ON]->(newComment)
             RETURN newComment`,
            { userId, commentId, movieId, text }
        );
        return result.records[0].get('newComment').properties;
    } finally {
        await session.close();
    }
};

exports.editReview = async (reviewId, newText) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Review {id: $reviewId})
             SET r.text = $newText, r.updatedAt = datetime()
             RETURN r`,
            { reviewId, newText }
        );
        return result.records[0].get('r').properties;
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

exports.removeReview = async (reviewId) => {
    const session = driver.session();
    try {
        await session.run(
            `MATCH (r:Review {id: $reviewId})
             DETACH DELETE r`,
            { reviewId }
        );
        return true;
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

exports.toggleLikeReview = async (userId, reviewId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId}), (r:Review {id: $reviewId})
             OPTIONAL MATCH (u)-[l:LIKED]->(r)
             WITH u, r, l
             CALL apoc.do.when(
               l IS NULL,
               'CREATE (u)-[:LIKED]->(r) RETURN true',
               'DELETE l RETURN false',
               {u: u, r: r, l: l}
             ) YIELD value
             RETURN value`,
            { userId, reviewId }
        );
        return result.records[0].get('value');
    } finally {
        await session.close();
    }
};
