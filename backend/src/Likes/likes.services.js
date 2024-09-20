const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.getLikesOfUser = async (uid) => {
    const session = driver.session();
    // console.log("getLikesOfUser", uid);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(p)
            WHERE u.uid = $uid AND (p:Post OR p:Review)
            RETURN p`,
            { uid }
        );
        // console.log(result);
        const  likedPosts = result.records.map(record => record.get('p'));
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
        const likeCount = result.records[0].get('likeCount').toInt();
        return likeCount;
    } finally {
        await session.close();
    }
};

exports.getLikesOfComment = async(commentId) => {
    const session = driver.session();
    // console.log("getLikesOfComment", commentId);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(c:Comment)
            WHERE c.commentId = $commentId
            RETURN count(u) AS likeCount`,
            { commentId }
        );

        // console.log(result);
        // Check if there are any records returned, if not, return 0
        if (result.records.length === 0) {
            return 0;
        }

        const likeCount = result.records[0].get('likeCount').toInt();
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
        const likeCount = result.records[0].get('likeCount').toInt();
        return likeCount;
    } finally {
        await session.close();
    }
};

exports.getLikesOfPost = async (postId) => {
    const session = driver.session();
    // console.log("getLikesOfPost", postId);
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

        const likeCount = result.records[0].get('likeCount').toInt();
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
            return true; // Entity liked
        }
    } catch (error) {
        console.error(`Error toggling like on review:`, error);
        throw new Error(`An error occurred while toggling like on the review`);
    } finally {
        await session.close();
    }
};

exports.toggleLikeComment = async(uid, commentId) => { //Doesnt work
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User), (c:Comment)
            WHERE u.uid = $uid AND c.commentId = $commentId
            MATCH (u)-[like:LIKES]->(c)
            RETURN like`,
            { uid, commentId }
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u:User), (c:Comment)
                WHERE u.uid = $uid AND c.commentId = $commentId
                MATCH (u)-[like:LIKES]->(c)
                DETACH DELETE like`,
                { uid, commentId }
            );
            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u:User), (c:Comment)
                WHERE u.uid = $uid AND c.commentId = $commentId
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
            return true; // Entity liked
        }
    } catch (error) {
        console.error(`Error toggling like on Post:`, error);
        throw new Error(`An error occurred while toggling like on the Post`);
    } finally {
        await session.close();
    }
};

const processGets= async(datas) =>{
    console.log('Enter processGets with ',datas);
  return datas.map(data => {
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

process.on('exit', () => {
    driver.close();
});