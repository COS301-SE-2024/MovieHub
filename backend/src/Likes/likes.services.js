import { get, getDatabase, push, ref, set } from "firebase/database";
const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));

exports.getLikesOfUser = async (uid) => {
    const session = driver.session();
    console.log("getLikesOfUser", uid);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(p)
            WHERE u.uid = $uid AND (p:Post OR p:Review)
            RETURN p`,
            { uid }
        );
        console.log(result);
        const likedPosts = result.records.map((record) => record.get("p"));
        return likedPosts;
    } finally {
        await session.close();
    }
};

exports.getLikesOfReview = async (reviewId) => {
    const session = driver.session();
    // console.log("getLikesOfReview", reviewId);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(r:Review)
            WHERE r.reviewId = $reviewId
            RETURN count(u) AS likeCount`,
            { reviewId }
        );

        // console.log(result);
        const likeCount = result.records[0].get("likeCount").toInt();
        return likeCount;
    } finally {
        await session.close();
    }
};

exports.getLikesOfComment = async (commentId) => {
    const session = driver.session();
    // console.log("getLikesOfComment", commentId);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(c:Comment)
            WHERE c.comId = $commentId
            RETURN count(u) AS likeCount`,
            { commentId }
        );

        // console.log(result);
        // Check if there are any records returned, if not, return 0
        if (result.records.length === 0) {
            return 0;
        }

        const likeCount = result.records[0].get("likeCount").toInt();
        return likeCount;
    } finally {
        await session.close();
    }
};

exports.getLikesOfMovie = async (movieId) => {
    const session = driver.session();
    console.log("getLikesOfMovie", movieId);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(m:Movie)
            WHERE m.movieId = $movieId
            RETURN count(u) AS likeCount`,
            { movieId }
        );

        // console.log(result);
        const likeCount = result.records[0].get("likeCount").toInt();
        return likeCount;
    } finally {
        await session.close();
    }
};

exports.getLikesOfPost = async (postId) => {
    const session = driver.session();
    console.log("getLikesOfPost", postId);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(p:Post)
            WHERE p.postId = $postId
            RETURN count(u) AS likeCount`,
            { postId }
        );

        // console.log(result);

        // Check if there are any records returned, if not, return 0
        if (result.records.length === 0) {
            return 0;
        }

        const likeCount = result.records[0].get("likeCount").toInt();
        // console.log("Check the like count: ", likeCount);
        return likeCount;
    } catch (error) {
        console.error("Error getting likes of post:", error);
        return 0; // Return 0 in case of an error
    } finally {
        await session.close();
    }
};

exports.toggleLikeReview = async (uid, reviewId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User), (r:Review)
            WHERE u.uid = $uid AND r.reviewId = $reviewId
            MATCH (u)-[like:LIKES]->(r)
            RETURN like`,
            { uid, reviewId }
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u:User), (r:Review)
                WHERE u.uid = $uid AND r.reviewId = $reviewId
                MATCH (u)-[like:LIKES]->(r)
                DETACH DELETE like`,
                { uid, reviewId }
            );

            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u:User), (r:Review)
                WHERE u.uid = $uid AND r.reviewId = $reviewId
                MERGE (u)-[:LIKES]->(r)`,
                { uid, reviewId }
            );

            // Fetch the review owner UID and details
            const ownerResult = await session.run(
                `MATCH (r:Review {reviewId: $reviewId})<-[:REVIEWED]-(owner:User)
                 RETURN owner.uid AS ownerUid, owner.username AS ownerUsername, r.reviewTitle AS reviewTitle, r.avatar AS avatar`,
                { reviewId }
            );

            if (ownerResult.records.length === 0) {
                throw new Error("Review owner not found");
            }

            // console.log("Owner result: ", ownerResult.records);

            const ownerUid = ownerResult.records[0].get("ownerUid");
            const ownerUsername = ownerResult.records[0].get("ownerUsername");
            const reviewTitle = ownerResult.records[0].get("reviewTitle");
            const ownerAvatar = ownerResult.records[0].get("avatar");

            // fetch liker details by uid
            const likerResult = await session.run(
                `MATCH (u:User {uid: $uid})
                 RETURN u.uid AS uid, u.username AS username, u.avatar AS avatar`,
                { uid }
            );

            console.log("Liker result: ", likerResult.records);

            const username = likerResult.records[0].get("username");
            const avatar = likerResult.records[0].get("avatar");

            // Send a notification to the review owner
            const db = getDatabase();
            const notificationsRef = ref(db, `notifications/${ownerUid}/likes`);
            const newNotificationRef = push(notificationsRef);

            // Set the notification details
            await set(newNotificationRef, {
                message: `${username} liked your review.`,
                reviewId: reviewId,
                poster: ownerResult.records[0],
                likedBy: uid,
                avatar: avatar,
                reviewTitle: reviewTitle,
                username: username,
                notificationType: "review_like",
                timestamp: new Date().toISOString(),
                read: false, // Mark notification as unread
            });

            console.log(`Notification sent to ${ownerUid}`);

            return true; // Entity liked
        }
    } catch (error) {
        console.error(`Error toggling like on review:`, error);
        throw new Error(`An error occurred while toggling like on the review`);
    } finally {
        await session.close();
    }
};

exports.toggleLikeComment = async (uid, commentId) => {
    //Doesnt work
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User), (c:Comment)
            WHERE u.uid = $uid AND c.comId = $commentId
            MATCH (u)-[like:LIKES]->(c)
            RETURN like`,
            { uid, commentId }
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u:User), (c:Comment)
                WHERE u.uid = $uid AND c.comId = $commentId
                MATCH (u)-[like:LIKES]->(c)
                DETACH DELETE like`,
                { uid, commentId }
            );
            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u:User), (c:Comment)
                WHERE u.uid = $uid AND c.comId = $commentId
                MERGE (u)-[:LIKES]->(c)`,
                { uid, commentId }
            );
            return true; // Entity liked
        }
    } catch (error) {
        console.error(`Error toggling like on Comment:`, error);
        throw new Error(`An error occurred while toggling like on the Comment`);
    } finally {
        await session.close();
    }
};

exports.toggleLikeMovie = async (uid, movieId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User), (m:Movie)
            WHERE u.uid = $uid AND m.movieId = $movieId
            MATCH (u)-[like:LIKES]->(m)
            RETURN like`,
            { uid, movieId }
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u:User), (m:Movie)
                WHERE u.uid = $uid AND m.movieId = $movieId
                MATCH (u)-[like:LIKES]->(m)
                DETACH DELETE like`,
                { uid, movieId }
            );
            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u:User), (m:Movie)
                WHERE u.uid = $uid AND m.movieId = $movieId
                MERGE (u)-[:LIKES]->(m)`,
                { uid, movieId }
            );
            return true; // Entity liked
        }
    } catch (error) {
        console.error(`Error toggling like on Movie:`, error);
        throw new Error(`An error occurred while toggling like on the Movie`);
    } finally {
        await session.close();
    }
};

exports.toggleLikePost = async (uid, postId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User), (p:Post)
            WHERE u.uid = $uid AND p.postId = $postId
            MATCH (u)-[like:LIKES]->(p)
            RETURN like`,
            { uid, postId }
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u:User), (p:Post)
                WHERE u.uid = $uid AND p.postId = $postId
                MATCH (u)-[like:LIKES]->(p)
                DETACH DELETE like`,
                { uid, postId }
            );
            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u:User), (p:Post)
                WHERE u.uid = $uid AND p.postId = $postId
                MERGE (u)-[:LIKES]->(p)`,
                { uid, postId }
            );

            // Fetch the post owner UID and details
            const ownerResult = await session.run(
                `MATCH (p:Post {postId: $postId})<-[:POSTED]-(owner:User)
                 RETURN owner.uid AS ownerUid, owner.username AS ownerUsername, p.postTitle AS postTitle, p.avatar AS postAvatar`,
                { postId }
            );

            // fetch liker details by uid
            const likerResult = await session.run(
                `MATCH (u:User {uid: $uid})
                 RETURN u.uid AS uid, u.username AS username, u.avatar AS avatar`,
                { uid }
            );

            console.log("like", likerResult.records[0]);

            const likerUid = likerResult.records[0].get("uid");
            const likerUsername = likerResult.records[0].get("username");
            const avatar = likerResult.records[0].get("avatar");

            if (ownerResult.records.length === 0) {
                throw new Error("Failed to fetch post owner details");
            }

            const ownerUid = ownerResult.records[0].get("ownerUid");
            const ownerUsername = ownerResult.records[0].get("ownerUsername");
            const postTitle = ownerResult.records[0].get("postTitle");
            const postAvatar = ownerResult.records[0].get("postAvatar");

            // Send a notification to the post owner
            const db = getDatabase();
            const notificationsRef = ref(db, `notifications/${ownerUid}/likes`);
            const newNotificationRef = push(notificationsRef);

            // Set the notification details
            await set(newNotificationRef, {
                message: `${likerUsername} liked your post.`,
                postId: postId,
                poster: likerResult.records[0],
                likedBy: uid,
                postTitle: postTitle,
                avatar: avatar,
                username: likerUsername,
                notificationType: "post_like",
                timestamp: new Date().toISOString(),
                read: false, // Mark notification as unread
            });

            console.log(`Notification sent to ${ownerUid}`);

            return true; // Entity liked
        }
    } catch (error) {
        console.error(`Error toggling like on Post:`, error);
        throw new Error(`An error occurred while toggling like on the Post`);
    } finally {
        await session.close();
    }
};

const processGets = async (datas) => {
    console.log("Enter processGets with ", datas);
    return datas.map((data) => {
        // Access the ID
        // console.log(data);
        // console.log(data.id);
        const id = data.id.toNumber(); // Convert neo4j.Integer to JavaScript number
        console.log(id);
        // Access the node properties
        const properties = data.post.properties; // This is an object containing the node's properties

        // Return the processed data
        return { id, properties };
    });
};

// Function to check if a user has liked a specific entity (Movie, Post, Review)
exports.hasUserLikedEntity = async (uid, entityId, entityType) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User)-[like:LIKES]->(e:${entityType})
            WHERE u.uid = $uid AND e.${entityType.toLowerCase()}Id = $entityId
            RETURN like`,
            { uid, entityId }
        );
        return result.records.length > 0;
    } finally {
        await session.close();
    }
};

process.on("exit", () => {
    driver.close();
});
