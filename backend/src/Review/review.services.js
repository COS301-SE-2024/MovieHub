const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
    'neo4j+s://d16778b5.databases.neo4j.io',
    neo4j.auth.basic('neo4j', '1yDboUOlGobuDEJX6xw_JitPl-93pTFKN6iYJCyyvt0')
);

exports.addReview = async (userId, movieId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId}), (m:Movie {id: $movieId})
             CREATE (r:Review {id: randomUUID(), text: $text, createdAt: datetime()})
             CREATE (u)-[:REVIEWED]->(r)-[:REVIEWED_ON]->(m)
             RETURN r`,
            { userId, movieId, text }
        );
        if (result.records.length > 0) {
            return result.records[0].get('r').properties;
        } else {
            throw new Error("No review created");
        }
    } finally {
        await session.close();
    }
};

exports.addCommentToReview = async (userId, reviewId, movieId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId}), (r:Review {id: $reviewId})
             CREATE (c:Comment {id: randomUUID(), text: $text, movieId: $movieId, createdAt: datetime()})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(r)
             RETURN c`,
            { userId, reviewId, movieId, text }
        );
        if (result.records.length > 0) {
            return result.records[0].get('c').properties;
        } else {
            throw new Error("No comment created");
        }
    } finally {
        await session.close();
    }
};

exports.addCommentToComment = async (userId, commentId, movieId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {id: $userId}), (c:Comment {id: $commentId})
             CREATE (nc:Comment {id: randomUUID(), text: $text, movieId: $movieId, createdAt: datetime()})
             CREATE (u)-[:COMMENTED]->(nc)-[:COMMENTED_ON]->(c)
             RETURN nc`,
            { userId, commentId, movieId, text }
        );
        if (result.records.length > 0) {
            return result.records[0].get('nc').properties;
        } else {
            throw new Error("No comment created");
        }
    } finally {
        await session.close();
    }
};

exports.editReview = async (reviewId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Review {id: $reviewId})
             SET r.text = $text, r.updatedAt = datetime()
             RETURN r`,
            { reviewId, text }
        );
        if (result.records.length > 0) {
            return result.records[0].get('r').properties;
        } else {
            throw new Error("Review not found");
        }
    } finally {
        await session.close();
    }
};

exports.editComment = async (commentId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {id: $commentId})
             SET c.text = $text, c.updatedAt = datetime()
             RETURN c`,
            { commentId, text }
        );
        if (result.records.length > 0) {
            return result.records[0].get('c').properties;
        } else {
            throw new Error("Comment not found");
        }
    } finally {
        await session.close();
    }
};

exports.removeReview = async (reviewId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Review {id: $reviewId})
             DETACH DELETE r`,
            { reviewId }
        );
        if (result.summary.counters.nodesDeleted() > 0) {
            return true;
        } else {
            throw new Error("Review not found");
        }
    } finally {
        await session.close();
    }
};

exports.removeComment = async (commentId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {id: $commentId})
             DETACH DELETE c`,
            { commentId }
        );
        if (result.summary.counters.nodesDeleted() > 0) {
            return true;
        } else {
            throw new Error("Comment not found");
        }
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
        if (result.records.length > 0) {
            return result.records[0].get('liked');
        } else {
            throw new Error("Review or user not found");
        }
    } finally {
        await session.close();
    }
};

exports.getReviewsOfMovie = async (movieId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (m:Movie {id: $movieId})<-[:REVIEWED_ON]-(r:Review)
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
            `MATCH (r:Review {id: $reviewId})<-[:COMMENTED_ON]-(c:Comment)
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
            `MATCH (u:User {id: $userId})-[:REVIEWED]->(r:Review)
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
            `MATCH (u:User {id: $userId})-[:COMMENTED]->(c:Comment)
             RETURN c`,
            { userId }
        );
        return result.records.map(record => record.get('c').properties);
    } finally {
        await session.close();
    }
};
