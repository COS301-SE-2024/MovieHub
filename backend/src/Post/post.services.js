
const { v4: uuidv4 } = require('uuid');

const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

//POSTS//

exports.addPost = async (uid, movieId, text, postTitle, img) => {
    console.log("In Services: addPost");
    const session = driver.session();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    try {
        const postId = uuidv4();
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (m:Movie {movieId: $movieId})
             CREATE (p:Post {postId: $postId, text: $text, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, movieId: $movieId, postTitle: $postTitle, img: $img, username : u.username, avatar : u.avatar, name : u.name})
             CREATE (u)-[:POSTED]->(p)-[:POSTED_ON]->(m)
             RETURN p`,
            { uid, movieId, text, postId, postTitle, img, createdAt, updatedAt }
        );
        console.log("The Result: ", result.summary);
        return result.records[0].get('p').properties;
    } catch (error) {
        console.error("Error adding post: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.addReview = async (uid, movieId, text, rating, reviewTitle) => {
    console.log("In Services: addReview");
    const session = driver.session();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    try {
        const reviewId = uuidv4();
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (m:Movie {movieId: $movieId})
             CREATE (r:Review {reviewId: $reviewId, text: $text, rating: $rating, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, movieId: $movieId, reviewTitle: $reviewTitle, username : u.username, avatar : u.avatar, name : u.name})
             CREATE (u)-[:REVIEWED]->(r)-[:REVIEWED_ON]->(m)
             RETURN r`,
            { uid, movieId, text, rating, reviewId, reviewTitle, createdAt, updatedAt }
        );
        console.log("The Result: ", result.summary);
        return result.records[0].get('r').properties;
    } catch (error) {
        console.error("Error adding review: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

// ADD Comment //

exports.addCommentToPost = async (uid, postId, text) => {
    console.log("In Services: addCommentToPost");
    const session = driver.session();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    try {
        const comId = uuidv4();
        const reviewId = -1;
        const comOnId = -1;
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (p:Post {postId: $postId})
             CREATE (c:Comment {comId: $comId, text: $text, movieId: p.movieId, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, postId: $postId, reviewId: $reviewId, comOnId: $comOnId , username : u.username, avatar : u.avatar , name : u.name})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(p)
             RETURN c`,
            { uid, postId, text, comId, reviewId, comOnId, createdAt, updatedAt }
        );
        return result.records[0].get('c').properties;
    } catch (error) {
        console.error("Error adding comment to post: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.addCommentToReview = async (uid, reviewId, text) => {
    console.log("In Services: addCommentToReview");
    const session = driver.session();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    try {
        const comId = uuidv4();
        const postId = -1;
        const comOnId = -1;
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (r:Review {reviewId: $reviewId})
             CREATE (c:Comment {comId: $comId, text: $text, movieId: r.movieId, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, reviewId: $reviewId, postId: $postId, comOnId: $comOnId, username : u.username, avatar : u.avatar , name : u.name})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(r)
             RETURN c`,
            { uid, reviewId, text, comId, postId, comOnId, createdAt, updatedAt }
        );
        return result.records[0].get('c').properties;
    } catch (error) {
        console.error("Error adding comment to review: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.addCommentToComment = async (uid, comOnId, text) => {
    console.log("In Services: addCommentToComment");
    const session = driver.session();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    try {
        const comId = uuidv4();
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (c:Comment {comId: $comOnId})
             CREATE (n:Comment {comId: $comId, comOnId: $comOnId, text: $text, movieId: c.movieId, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, postId: c.postId, reviewId: c.reviewId, username : u.username, avatar : u.avatar, name : u.name})
             CREATE (u)-[:COMMENTED]->(n)-[:COMMENTED_ON]->(c)
             RETURN n`,
            { uid, comOnId, text, comId, createdAt, updatedAt }
        );
        return result.records[0].get('n').properties;
    } catch (error) {
        console.error("Error adding comment to comment: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

// EDIT //
exports.editPost = async (postId, uid, text) => {
    console.log("In Services: editPost");
    const session = driver.session();
    const updatedAt = new Date().toISOString();
    try {
        const result = await session.run(
            `MATCH (p:Post {postId: $postId, uid: $uid})
             SET p.text = $text, p.updatedAt = $updatedAt
             RETURN p`,
            { postId, uid, text, updatedAt }
        );
        if (result.records.length === 0) {
            throw new Error("Post not found or user not authorized to edit this post");
        }
        return result.records[0].get('p').properties;
    } catch (error) {
        console.error("Error editing post: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.editReview = async (reviewId, uid, text) => {
    console.log("In Services: editReview");
    const session = driver.session();
    const updatedAt = new Date().toISOString();
    try {
        const result = await session.run(
            `MATCH (r:Review {reviewId: $reviewId, uid: $uid})
             SET r.text = $text, r.updatedAt = $updatedAt
             RETURN r`,
            { reviewId, uid, text, updatedAt }
        );
        if (result.records.length === 0) {
            throw new Error("Review not found or user not authorized to edit this review");
        }
        return result.records[0].get('r').properties;
    } catch (error) {
        console.error("Error editing review: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.editComment = async (commentId, uid, text) => {
    console.log("In Services: editComment");
    const session = driver.session();
    const updatedAt = new Date().toISOString();
    try {
        const result = await session.run(
            `MATCH (c:Comment {comId: $commentId, uid: $uid})
             SET c.text = $text, c.updatedAt = $updatedAt
             RETURN c`,
            { commentId, uid, text, updatedAt }
        );
        if (result.records.length === 0) {
            throw new Error("Comment not found or user not authorized to edit this comment");
        }
        return result.records[0].get('c').properties;
    } catch (error) {
        console.error("Error editing comment: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

// DELETE //

exports.removePost = async (postId, uid) => {
    console.log("In Services: removePost");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (p:Post {postId: $postId, uid: $uid})
             DETACH DELETE p
             RETURN p`,
            { postId, uid }
        );
        if (result.records.length === 0) {
            throw new Error("Post not found or user not authorized to remove this post");
        }
        return true;
    } catch (error) {
        console.error("Error removing post: ", error);
        throw error;
    } finally {
        await session.close();
    }
};


exports.removeReview = async (reviewId, uid) => {
    console.log("In Services: removeReview");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Review {reviewId: $reviewId, uid: $uid})
             DETACH DELETE r
             RETURN r`,
            { reviewId, uid }
        );
        if (result.records.length === 0) {
            throw new Error("Review not found or user not authorized to remove this review");
        }
        return true;
    } catch (error) {
        console.error("Error removing review: ", error);
        throw error;
    } finally {
        await session.close();
    }
};


exports.removeComment = async (commentId, uid) => {
    console.log("In Services: removeComment");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {comId: $commentId, uid: $uid})
             DETACH DELETE c
             RETURN c`,
            { commentId, uid }
        );
        if (result.records.length === 0) {
            throw new Error("Comment not found or user not authorized to remove this comment");
        }
        return true;
    } catch (error) {
        console.error("Error removing comment: ", error);
        throw error;
    } finally {
        await session.close();
    }
};


//GETS//

exports.getPostsOfMovie = async (movieId) => {
    console.log("In Services: getPostsOfMovie");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (m:Movie {movieId: $movieId})<-[:POSTED_ON]-(p:Post)
             RETURN p`,
            { movieId }
        );
        if (result.records.length === 0) {
            return result.records;
        }
        return result.records.map(record => record.get('p').properties);
    } catch (error) {
        console.error("Error getting posts of movie: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getReviewsOfMovie = async (movieId) => {
    console.log("In Services: getReviewsOfMovie");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (m:Movie {movieId: $movieId})<-[:REVIEWED_ON]-(r:Review)
             RETURN r`,
            { movieId }
        );
        if (result.records.length === 0) {
            return result.records;
        }
        return result.records.map(record => record.get('r').properties);
    } catch (error) {
        console.error("Error getting reviews of movie: ", error);
        throw error;
    } finally {
        await session.close();
    }
};


exports.getCommentsOfPost = async (postId) => {
    console.log("In Services: getCommentsOfPost");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (p:Post {postId: $postId})<-[:COMMENTED_ON]-(c:Comment)
             RETURN c`,
            { postId }
        );
        if (result.records.length === 0) {
            return result.records;
        }
        return result.records.map(record => record.get('c').properties);
    } catch (error) {
        console.error("Error getting comments of post: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getCommentsOfReview = async (reviewId) => {
    console.log("In Services: getCommentsOfReview");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Review {reviewId: $reviewId})<-[:COMMENTED_ON]-(c:Comment)
             RETURN c`,
            { reviewId }
        );
        if (result.records.length === 0) {
            return result.records;
        }
        return result.records.map(record => record.get('c').properties);
    } catch (error) {
        console.error("Error getting comments of review: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getPostsOfUser = async (uid) => {
    console.log("In Services: getPostsOfUser");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:POSTED]->(p:Post)
             RETURN p`,
            { uid }
        );
        if (result.records.length === 0) {
            return ;
        }
        return result.records.map(record => record.get('p').properties);
    } catch (error) {
        console.error("Error getting posts of user: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getReviewsOfUser = async (uid) => {
    console.log("In Services: getReviewsOfUser");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:REVIEWED]->(r:Review)
             RETURN r`,
            { uid }
        );
        if (result.records.length === 0) {
            return result.records;
        }
        return result.records.map(record => record.get('r').properties);
    } catch (error) {
        console.error("Error getting reviews of user: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getCommentsOfUser = async (uid) => {
    console.log("In Services: getCommentsOfUser");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:COMMENTED]->(c:Comment)
             RETURN c`,
            { uid }
        );
        if (result.records.length === 0) {
            return result.records;
        }
        return result.records.map(record => record.get('c').properties);
    } catch (error) {
        console.error("Error getting comments of user: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getAverageRating = async (movieId) => {
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (m:Movie {movieId: $movieId})<-[:REVIEWED_ON]-(r:Review)
            RETURN avg(r.rating) AS averageRating
            `,
            { movieId }
        );

        if (result.records.length === 0) {
            return result.records;
        }

        const averageRating = result.records[0].get('averageRating').toFixed(2); // toFixed to round to 2 decimal places
        return averageRating;
    } catch (error) {
        console.error("Error getting average rating: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getCountCommentsOfPost = async (postId) => {
    console.log("In Services: getTotalCommentsOfPost");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {postId: $postId})
             RETURN count(c) AS totalComments`,
            { postId }
        );
        const totalComments = result.records[0].get('totalComments').toInt();
        return totalComments;
    } catch (error) {
        console.error("Error getting total comments of post: ", error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getCountCommentsOfReview = async (reviewId) => {
    console.log("In Services: getTotalCommentsOfReview");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {reviewId: $reviewId})
             RETURN count(c) AS totalComments`,
            { reviewId }
        );
        const totalComments = result.records[0].get('totalComments').toInt();
        return totalComments;
    } catch (error) {
        console.error("Error getting total comments of review: ", error);
        throw error;
    } finally {
        await session.close();
    }
};
