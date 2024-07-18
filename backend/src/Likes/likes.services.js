const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.getLikesOfUser = async (uid) => {
    const session = driver.session();
    console.log("getLikesOfUser", uid);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(p:Post)
            WHERE u.uid = $uid
            RETURN p`,
            { uid }
        );
        console.log(result);
        const  reviews = result.records.map(record => record.get('data'));
        const data = await processGets(reviews); // Await the processGets call
        return data;
    } finally {
        await session.close();
    }
};

exports.getLikes = async ( entityType) => {
    const session = driver.session();
    console.log("getLikes", entityType);
    try {
        const result = await session.run(
            `MATCH (u:User)-[:LIKES]->(e:${entityType})
            WHERE u.uid = $uid
            RETURN e`,
            { uid }
        );

        console.log(result);
        const entities = result.records.map(record => record.get('data'));
        const data = await processGets(entities); // Await the processGets call if necessary
        return data;
    } finally {
        await session.close();
    }
};

exports.getLikesOfReview = async (uid, reviewId) => {
    return getLikes(uid, reviewId, 'Review');
};

exports.getLikesOfComment = async(uid, commentId) => {
    return getLikes(uid, commentId, 'Comment');
};

exports.getLikesOfMovie = async (uid, movieId) => {
    return getLikes(uid, movieId, 'Movie');
};

exports.getLikesOfPost = async (uid, postId) => {
    return getLikes(uid, postId, 'Post');
};

async function toggleLike(uid, entityId, entityType) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User) (e)
            WHERE u.uid = $uid AND ID(e) = $entityId
            MATCH (u)-[like:LIKES]->(e)
            RETURN like`,
            { uid, entityId }
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u:User) (e)
                WHERE u.uid = $uid AND ID(e) = $entityId
                MATCH (u)-[like:LIKES]->(e)
                DETACH DELETE like`,
                { uid, entityId }
            );
            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u:User) (e)
                WHERE u.uid = $uid AND ID(e) = $entityId
                MERGE (u)-[:LIKES]->(e)`,
                { uid, entityId }
            );
            return true; // Entity liked
        }
    } catch (error) {
        console.error(`Error toggling like on ${entityType.toLowerCase()}:`, error);
        throw new Error(`An error occurred while toggling like on the ${entityType.toLowerCase()}`);
    } finally {
        await session.close();
    }
}

exports.toggleLikeReview = async (uid, reviewId) => {
    return toggleLike(uid, reviewId, 'Review');
};

exports.toggleLikeComment = async(uid, commentId) => {
    return toggleLike(uid, commentId, 'Comment');
};

exports.toggleLikeMovie = async (uid, movieId) => {
    return toggleLike(uid, movieId, 'Movie');
};

exports.toggleLikePost = async (uid, postId) => {
    return toggleLike(uid, postId, 'Post');
};

process.on('exit', () => {
    driver.close();
});

const processGets= async(datas) =>{
    console.log('Enter processGets with ',datas);
  return datas.map(data => {
    // Access the ID
    console.log(data);
    console.log(data.id);
    const id = data.id.toNumber(); // Convert neo4j.Integer to JavaScript number
    console.log(id);
    // Access the node properties
    const properties = data.post.properties; // This is an object containing the node's properties

    // Return the processed data
    return { id, properties };
   });
  };