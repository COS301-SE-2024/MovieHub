const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

//POSTS//

exports.addPost = async (userId, movieId, text, postTitle, img) => {
    console.log("In Services: ");
    const session = driver.session();
    try {
        const postId = uuidv4();
        const result = await session.run(
            `MATCH (u {userId: $userId}), (m {movieId: $movieId})
             CREATE (p:Post {postId: $postId, text: $text, createdAt: datetime(), updatedAt: datetime(), userId: $userId, movieId: $movieId, postTitle: $postTitle,  img: $img})
             CREATE (u)-[:POSTED]->(p)-[:POSTED_ON]->(m)
             RETURN p`,
            { userId, movieId, text, postId, postTitle, img }
        );
        console.log("The Result " + result.summary);
        return result.records[0].get('p').properties;
    } finally {
        await session.close();
    }
};

exports.addReview = async (userId, movieId, text, rating, reviewTitle) => {
    console.log("In Services: ");
    const session = driver.session();
    try {
        const reviewId = uuidv4();
        const result = await session.run(
            `MATCH (u {userId: $userId}), (m {movieId: $movieId})
             CREATE (r:Review {reviewId: $reviewId, text: $text, rating: $rating, createdAt: datetime(), updatedAt: datetime(), userId: $userId, movieId: $movieId, reviewTitle: $reviewTitle})
             CREATE (u)-[:REVIEWED]->(r)-[:REVIEWED_ON]->(m)
             RETURN r`,
            { userId, movieId, text, rating, reviewId, reviewTitle }
        );
        console.log("The Result " + result.summary);
        return result.records[0].get('r').properties;
    } finally {
        await session.close();
    }
};

// ADD Comment //

exports.addCommentToPost = async (userId, postId, text) => {
    const session = driver.session();
    try {
        const comId = uuidv4();
        const reviewId = -1;
        const comOnId = -1;
        const result = await session.run(
            `MATCH (u {userId: $userId}), (p {postId: $postId})
             CREATE (c:Comment {comId: $comId, text: $text, movieId: p.movieId, createdAt: datetime(), updatedAt: datetime(), userId: $userId, postId: $postId, review: $reviewId, comOnId: $comOnId})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(p)
             RETURN c`,
            { userId, postId, text, comId, reviewId, comOnId }
        );
        return result.records[0].get('c').properties;
    } finally {
        await session.close();
    }
};

exports.addCommentToReview = async (userId, reviewId, text) => {
    const session = driver.session();
    try {
        const comId = uuidv4();
        const postId = -1;
        const comOnId = -1;
        const result = await session.run(
            `MATCH (u {userId: $userId}), (r {reviewId: $reviewId})
             CREATE (c:Comment {comId: $comId, text: $text, movieId: r.movieId, createdAt: datetime(), updatedAt: datetime(), userId: $userId, reviewId: $reviewId, postId: $postId,comOnId: $comOnId})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(r)
             RETURN c`,
            { userId, reviewId, text, comId, postId, comOnId}
        );
        return result.records[0].get('c').properties;
    } finally {
        await session.close();
    }
};

exports.addCommentToComment = async (userId, comOnId, text) => {
    const session = driver.session();
    try {
        const comId = uuidv4();
        const result = await session.run(
            `MATCH (u {userId: $userId}), (c {comId: $comOnId})
             CREATE (n:Comment {comId: $comId, comOnId: $comOnId, text: $text, movieId: c.movieId, createdAt: datetime(), updatedAt: datetime(), userId: $userId, postId: c.postId, reviewId: c.reviewId})
             CREATE (u)-[:COMMENTED]->(n)-[:COMMENTED_ON]->(c)
             RETURN n`,
            { userId, comOnId, text, comId }
        );
        return result.records[0].get('n').properties;
    } finally {
        await session.close();
    }
};

// EDIT //
exports.editPost = async (postId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (p {postId: $postId})
             SET p.text = $text, p.updatedAt = datetime()
             RETURN p`,
            { postId, text }
        );
        return result.records[0].get('p').properties;
    } finally {
        await session.close();
    }
};

exports.editReview = async (reviewId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r {reviewId: $reviewId})
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
            `MATCH (c {comId: $commentId})
             SET c.text = $text, c.updatedAt = datetime()
             RETURN c`,
            { commentId, text }
        );
        return result.records[0].get('c').properties;
    } finally {
        await session.close();
    }
};

// DELETE //

exports.removePost = async (postId) => {
    const session = driver.session();
    try {
        await session.run(
            `MATCH (p {postId: $postId})
             DETACH DELETE p`,
            { postId }
        );
        return true;
    } finally {
        await session.close();
    }
};

exports.removeReview = async (reviewId) => {
    const session = driver.session();
    try {
        await session.run(
            `MATCH (r {reviewId: $reviewId})
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
            `MATCH (c {comId: $commentId})
             DETACH DELETE c`,
            { commentId }
        );
        return true;
    } finally {
        await session.close();
    }
};

//GETS//

exports.getPostsOfMovie = async (movieId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (m {movieId: $movieId})<-[:POSTED_ON]-(p:Post)
             RETURN p`,
            { movieId }
        );
        if (result.records.length === 0) {
            return null;
        }
        return result.records.map(record => record.get('p').properties);
    } finally {
        await session.close();
    }
};

exports.getReviewsOfMovie = async (movieId) => {
    const session = driver.session();
     try {
        const result = await session.run(
            `MATCH (m {movieId: $movieId})<-[:REVIEWED_ON]-(r:Review)
             RETURN r`,
            { movieId }
        );
        if (result.records.length === 0) {
            return null;
        }
        return result.records.map(record => record.get('r').properties);
    } finally {
        await session.close();
    }
};


exports.getCommentsOfPost = async (postId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (p {postId: $postId})<-[:COMMENTED_ON]-(c:Comment)
             RETURN c`,
            { postId }
        );
        if (result.records.length === 0) {
            return null;
        }
        return result.records.map(record => record.get('c').properties);
    } finally {
        await session.close();
    }
};

exports.getCommentsOfReview = async (reviewId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r {reviewId: $reviewId})<-[:COMMENTED_ON]-(c:Comment)
             RETURN c`,
            { reviewId }
        );
        if (result.records.length === 0) {
            return null;
        }
        return result.records.map(record => record.get('c').properties);
    } finally {
        await session.close();
    }
};

exports.getPostsOfUser = async (userId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u {userId: $userId})-[:POSTED]->(p:Post)
             RETURN p`,
            { userId }
        );
        if (result.records.length === 0) {
            return null;
        }
        return result.records.map(record => record.get('p').properties);
    } finally {
        await session.close();
    }
};

exports.getReviewsOfUser = async (userId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u {userId: $userId})-[:REVIEWED]->(r:Review)
             RETURN r`,
            { userId }
        );
        if (result.records.length === 0) {
            return null;
        }
        return result.records.map(record => record.get('r').properties);
    } finally {
        await session.close();
    }
};

exports.getCommentsOfUser = async (userId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u {userId: $userId})-[:COMMENTED]->(c:Comment)
             RETURN c`,
            { userId }
        );
        if (result.records.length === 0) {
            return null;
        }
        return result.records.map(record => record.get('c').properties);
    } finally {
        await session.close();
    }
};
