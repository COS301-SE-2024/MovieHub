const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
    'neo4j+s://d16778b5.databases.neo4j.io',
    neo4j.auth.basic('neo4j', '1yDboUOlGobuDEJX6xw_JitPl-93pTFKN6iYJCyyvt0')
);

exports.addReview = async (userId, movieId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u), (m)
             WHERE ID(u) = $userId AND ID(m) = $movieId
             CREATE (r:Review { text: $text, createdAt: datetime(), updatedAt: datetime(), userId: $userId, movieId: $movieId})
             CREATE (u)-[:REVIEWED]->(r)-[:REVIEWED_ON]->(m)
             RETURN r`,
            { userId, movieId, text }
        );
        //console.log(result.summary);
        return result.records[0].get('r').properties;
    } finally {
        await session.close();
    }
};

exports.addCommentToReview = async (userId, reviewId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u), (r)
             WHERE ID(u) = $userId AND ID(r) = $reviewId
             CREATE (c:Comment { text: $text, movieId: r.movieId, createdAt: datetime(), updatedAt: datetime(), userId: $userId, reviewId: $reviewId})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(r)
             RETURN c`,
            { userId, reviewId, text }
        );
        return result.records[0].get('c').properties;
    } finally {
        await session.close();
    }
};

exports.addCommentToComment = async (userId, commentId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u), (c) 
             WHERE ID(u) = $userId AND ID(c) = $commentId
             CREATE (n:Comment {parentCommentId: $commentId, text: $text, movieId: c.movieId, createdAt: datetime(), updatedAt: datetime(), userId: $userId, reviewId: c.reviewId})
             CREATE (u)-[:COMMENTED]->(n)-[:COMMENTED_ON]->(c)
             RETURN n`,
            { userId, commentId, text }
        );
        return result.records[0].get('n').properties;
    } finally {
        await session.close();
    }
};

exports.editReview = async (reviewId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r)
             WHERE ID(r) = $reviewId
             SET r.text = $text, r.updatedAt = datetime()
             RETURN r`,
            { reviewId, text }
        );
        return result.records[0].get('r').properties;
    } finally {
        await session.close();
    }
};

exports.editComment = async (commentId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c)
             WHERE ID(c) = $commentId
             SET c.text = $text, c.updatedAt = datetime()
             RETURN c`,
            { commentId, text }
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
            `MATCH (r)
             WHERE ID(r) = $reviewId
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
            `MATCH (c)
             WHERE ID(c) = $commentId
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
             OPTIONAL MATCH (u)-[like:LIKED]->(r)
             WITH u, r, like, CASE WHEN like IS NULL THEN true ELSE false END AS liked
             FOREACH (_ IN CASE WHEN liked THEN [1] ELSE [] END | CREATE (u)-[:LIKED]->(r))
             FOREACH (_ IN CASE WHEN NOT liked THEN [1] ELSE [] END | DELETE like)
             RETURN liked`,
            { userId, reviewId }
        );
        return result.records[0].get('liked');
    } finally {
        await session.close();
    }
};

exports.getReviewsOfMovie = async (movieId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (m)<-[:REVIEWED_ON]-(r:Review)
             WHERE ID(m) = $movieId
             RETURN r`,
            { movieId }
        );
        return result.records.map(record => record.get('r').properties);
    } finally {
        await session.close();
    }
};

exports.getCommentsOfReview = async (reviewId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r)<-[:COMMENTED_ON]-(c:Comment)
             WHERE ID(r) = $reviewId
             RETURN c`,
            { reviewId }
        );
        return result.records.map(record => record.get('c').properties);
    } finally {
        await session.close();
    }
};

exports.getReviewsOfUser = async (userId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u)-[:REVIEWED]->(r:Review)
             WHERE ID(u) = $userId
             RETURN r`,
            { userId }
        );
        return result.records.map(record => record.get('r').properties);
    } finally {
        await session.close();
    }
};

exports.getCommentsOfUser = async (userId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u)-[:COMMENTED]->(c:Comment)
            WHERE ID(u) = $userId
             RETURN c`,
            { userId }
        );
        return result.records.map(record => record.get('c').properties);
    } finally {
        await session.close();
    }
};