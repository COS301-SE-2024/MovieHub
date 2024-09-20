import { getDatabase, push, ref, set } from "firebase/database";
const { v4: uuidv4 } = require('uuid');
const neo4j = require('neo4j-driver');
require('dotenv').config();
import { addMovie } from '../movieHandeling/movie.services';

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

//POSTS//

exports.addPost = async (uid, text, postTitle, img) => {
    console.log("In Services: addPost");
    const session = driver.session();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    try {
        const postId = uuidv4();
        const result = await session.run(
            `MATCH (u:User {uid: $uid})
             CREATE (p:Post {postId: $postId, text: $text, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, postTitle: $postTitle, img: $img, username : u.username, avatar : u.avatar, name : u.name})
             CREATE (u)-[:POSTED]->(p)-[:POSTED_ON]->(m)
             RETURN p`,
            { uid, text, postId, postTitle, img, createdAt, updatedAt }
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


exports.addReview = async (uid, movieId, text, rating, reviewTitle, movieTitle, img) => {
    console.log("In Services: addReview");

    const movieAdded = await addMovie(movieId);

    const session = driver.session();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    try {
        const reviewId = uuidv4();
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (m:Movie {movieId: $movieId})
             CREATE (r:Review {reviewId: $reviewId, text: $text, rating: $rating, createdAt: $createdAt, updatedAt: $updatedAt, img: $img, uid: $uid, movieId: $movieId, reviewTitle: $reviewTitle, username : u.username, avatar : u.avatar, name : u.name, movieTitle: $movieTitle})
             CREATE (u)-[:REVIEWED]->(r)-[:REVIEWED_ON]->(m)
             RETURN r`,
            { uid, movieId, text, rating, reviewId, reviewTitle, movieTitle, img, createdAt, updatedAt }
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

        // Fetch the post, user, and post owner details
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (p:Post {postId: $postId})<-[:POSTED]-(owner:User)
             CREATE (c:Comment {comId: $comId, text: $text, movieId: p.movieId, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, postId: $postId, reviewId: $reviewId, comOnId: $comOnId , username: u.username, avatar: u.avatar, name: u.name})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(p)
             RETURN c, owner.uid AS ownerUid, owner.username AS ownerUsername`,
            { uid, postId, text, comId, reviewId, comOnId, createdAt, updatedAt }
        );

        // Extract the comment and owner details from the result
        const comment = result.records[0].get('c').properties;
        const ownerUid = result.records[0].get('ownerUid');
        const ownerUsername = result.records[0].get('ownerUsername');

        // Send a notification to the post owner using Firebase Realtime Database
        const db = getDatabase();
        const notificationsRef = ref(db, `notifications/${ownerUid}/comments`); // Reference to the owner's notifications
        const newNotificationRef = push(notificationsRef); // Create a new notification entry

        // Set the notification details
        await set(newNotificationRef, {
            message: `${comment.username} commented on your post.`,
            postId: postId,
            commentId: comId,
            commentedBy: uid,
            avatar: comment.avatar,
            user: commentusername,
            commenterName: comment.username,
            notificationType: 'post_comment',
            timestamp: new Date().toISOString(),
            read: false // Mark notification as unread
        });

        console.log(`User ${uid} commented on post ${postId}. Notification sent to post owner ${ownerUid}.`);

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
        const postId = -1; // Not applicable for reviews
        const comOnId = -1; // Not applicable for reviews

        // Create the comment and fetch the review owner details
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (r:Review {reviewId: $reviewId})<-[:WROTE]-(owner:User)
             CREATE (c:Comment {comId: $comId, text: $text, movieId: r.movieId, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, reviewId: $reviewId, postId: $postId, comOnId: $comOnId, username: u.username, avatar: u.avatar, name: u.name})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(r)
             RETURN c, owner.uid AS ownerUid, owner.username AS ownerUsername`,
            { uid, reviewId, text, comId, postId, comOnId, createdAt, updatedAt }
        );

        // Extract the comment and owner details from the result
        const comment = result.records[0].get('c').properties;
        const ownerUid = result.records[0].get('ownerUid');
        const ownerUsername = result.records[0].get('ownerUsername');

        // Send a notification to the review owner using Firebase Realtime Database
        const db = getDatabase();
        const notificationsRef = ref(db, `notifications/${ownerUid}/comments`); // Reference to the owner's notifications
        const newNotificationRef = push(notificationsRef); // Create a new notification entry

        // Set the notification details
        await set(newNotificationRef, {
            message: `${comment.username} commented on your review.`,
            reviewId: reviewId,
            commentId: comId,
            commentedBy: uid,
            avatar: comment.avatar,
            user: comment.username,
            commenterName: comment.username,
            notificationType: 'post_comment',
            timestamp: new Date().toISOString(),
            read: false // Mark notification as unread
        });

        console.log(`User ${uid} commented on review ${reviewId}. Notification sent to review owner ${ownerUid}.`);
        console.log("The Result: ", comment);
        // Return the comment details, including the profile picture
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

        // Fetch comment and post owner details and create the new comment
        const result = await session.run(
            `MATCH (u:User {uid: $uid}), (c:Comment {comId: $comOnId})<-[:COMMENTED]-(commentOwner:User), (p:Post {postId: c.postId})<-[:POSTED]-(postOwner:User)
             CREATE (n:Comment {comId: $comId, comOnId: $comOnId, text: $text, movieId: c.movieId, createdAt: $createdAt, updatedAt: $updatedAt, uid: $uid, postId: c.postId, reviewId: c.reviewId, username: u.username, avatar: u.avatar, name: u.name})
             CREATE (u)-[:COMMENTED]->(n)-[:COMMENTED_ON]->(c)
             RETURN n, commentOwner.uid AS commentOwnerUid, commentOwner.username AS commentOwnerUsername, postOwner.uid AS postOwnerUid, postOwner.username AS postOwnerUsername`,
            { uid, comOnId, text, comId, createdAt, updatedAt }
        );

        // Extract new comment, comment owner, and post owner details
        const newComment = result.records[0].get('n').properties;
        const commentOwnerUid = result.records[0].get('commentOwnerUid');
        const commentOwnerUsername = result.records[0].get('commentOwnerUsername');
        const postOwnerUid = result.records[0].get('postOwnerUid');
        const postOwnerUsername = result.records[0].get('postOwnerUsername');

        const db = getDatabase();

        // Send notification to the owner of the original comment (the one being replied to)
        const commentOwnerNotificationsRef = ref(db, `notifications/${commentOwnerUid}/comments`);
        const newCommentNotificationRef = push(commentOwnerNotificationsRef);
        await set(newCommentNotificationRef, {
            message: `${newComment.username} replied to your comment.`,
            commentId: comId,
            repliedOnCommentId: comOnId,
            repliedBy: uid,
            avatar: newComment.avatar,
            user: newComment.username,
            replierName: newComment.username,
            notificationType: 'comment_reply',
            timestamp: new Date().toISOString(),
            read: false // Mark notification as unread
        });

        // Send notification to the owner of the post
        if (postOwnerUid !== commentOwnerUid) { // Ensure we don't send duplicate notifications to the same person
            const postOwnerNotificationsRef = ref(db, `notifications/${postOwnerUid}/comments`);
            const newPostNotificationRef = push(postOwnerNotificationsRef);
            await set(newPostNotificationRef, {
                message: `${newComment.username} replied to a comment on your post.`,
                commentId: comId,
                postId: newComment.postId,
                repliedBy: uid,
                avatar: newComment.avatar,
                user: newComment.username,
                replierName: newComment.username,
                notificationType: 'post_comment',
                timestamp: new Date().toISOString(),
                read: false // Mark notification as unread
            });
        }

        console.log(`User ${uid} replied to comment ${comOnId}. Notifications sent to comment owner ${commentOwnerUid} and post owner ${postOwnerUid}.`);
        console.log("The Result: ", newComment);

        // Return the new comment details
        return result.records[0].get('n').properties;
    } catch (error) {
        console.error("Error adding comment to comment: ", error);
        throw error;
    } finally {
        await session.close();
    }
};


// EDIT //
exports.editPost = async (postId, uid, text, postTitle, img) => {
    console.log("In Services: editPost");
    const session = driver.session();
    const updatedAt = new Date().toISOString();
    try {
        const result = await session.run(
            `MATCH (p:Post {postId: $postId, uid: $uid})
             SET p.text = $text, p.updatedAt = $updatedAt, p.postTitle = $postTitle, p.img = $img
             RETURN p`,
            { postId, uid, text, updatedAt, postTitle, img }
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

exports.editReview = async (reviewId, uid, text, reviewTitle, rating, img) => {
    console.log("In Services: editReview");
    const session = driver.session();
    const updatedAt = new Date().toISOString();
    try {
        const result = await session.run(
            `MATCH (r:Review {reviewId: $reviewId, uid: $uid})
             SET r.text = $text, r.updatedAt = $updatedAt, r.rating = $rating, r.reviewTitle = $reviewTitle,r.img = $img
             RETURN r`,
            { reviewId, uid, text, reviewTitle, rating, updatedAt, img }
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

exports.updatePostsForUser = async (uid) => {
    console.log("In Services: updatePostsForUser");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:POSTED]->(p:Post {uid: $uid})
             SET p.username = u.username, p.name = u.name, p.avatar = u.avatar
             RETURN p`,
            { uid }
        );
        console.log("The Result: ", result.summary);
        return result.records.map(record => record.get('p').properties);
    } catch (error) {
        console.error("Error updating posts: ", error);
        throw error;
    } finally {
        await session.close();
    }
};
exports.updateUserContent = async (uid) => {
    console.log("In Services: updateUserContent");
    const session = driver.session();
    try {
        // Update Posts
        await session.run(
            `MATCH (u:User {uid: $uid})-[:POSTED]->(p:Post {uid: $uid})
             SET p.username = u.username, p.name = u.name, p.avatar = u.avatar`,
            { uid }
        );

        // Update Reviews
        await session.run(
            `MATCH (u:User {uid: $uid})-[:REVIEWED]->(r:Review {uid: $uid})
             SET r.username = u.username, r.name = u.name, r.avatar = u.avatar`,
            { uid }
        );

        // Update Comments
        await session.run(
            `MATCH (u:User {uid: $uid})-[:COMMENTED]->(c:Comment {uid: $uid})
             SET c.username = u.username, c.name = u.name, c.avatar = u.avatar`,
            { uid }
        );

        console.log("User content updated successfully for uid:", uid);
    } catch (error) {
        console.error("Error updating user content: ", error);
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
            `MATCH (p {postId: $postId, uid: $uid})
             DETACH DELETE p`,
            { postId, uid }
        );
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
            `MATCH (r {reviewId: $reviewId, uid: $uid})
             DETACH DELETE r`,
            { reviewId, uid }
        );
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
             OPTIONAL MATCH (c)<-[:COMMENTED_ON*]-(nestedComments)
             DETACH DELETE c, nestedComments`,
            { commentId, uid }
        );
        return true;
    } catch (error) {
        console.error("Error removing comment: ", error);
        throw error;
    } finally {
        await session.close();
    }
};


//GETS//



exports.getReviewsOfMovie = async (movieId) => {
    console.log("In Services: getReviewsOfMovie");
    const session = driver.session();
    movieId = Number(movieId);
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

exports.getCommentsOfComment = async (commentId) => {
    console.log("In Services: getCommentsOfComment");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {comOnId: $commentId})
             RETURN c`,
            { commentId }
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
    // console.log("In Services: getPostsOfUser");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:POSTED]->(p:Post)
             RETURN p`,
            { uid }
        );
        if (result.records.length === 0) {
            return result.records;
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
    // console.log("In Services: getCommentsOfUser");
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
    movieId = Number(movieId);
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
    // console.log("In Services: getTotalCommentsOfPost");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {postId: $postId})
             RETURN count(c) AS totalComments`,
            { postId }
        );
        // Check if there are any records returned, if not, return 0
        if (result.records.length === 0) {
            return 0;
        }

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
    // console.log("In Services: getTotalCommentsOfReview");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (c:Comment {reviewId: $reviewId})
             RETURN count(c) AS totalComments`,
            { reviewId }
        );
        // Check if there are any records returned, if not, return 0
        if (result.records.length === 0) {
            return 0;
        }

        const totalComments = result.records[0].get('totalComments').toInt();
        return totalComments;
    } catch (error) {
        console.error("Error getting total comments of review: ", error);
        throw error;
    } finally {
        await session.close();
    }
};
