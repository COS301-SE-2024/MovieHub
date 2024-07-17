const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

exports.getLikesOfUser = async (userId) => {
    const session = driver.session();
    console.log("getLikesOfUser", userId);
    userId = parseInt(userId, 10);
    if (isNaN(userId)) {
        throw new Error('Invalid User ID');
    }
    try {
        const result = await session.run(
            `MATCH (u)-[:LIKES]->(p:Post)
            WHERE ID(u) = $userId
            RETURN {post : p, id : ID(p)} as data`,
            { userId }
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
    // userId = parseInt(userId, 10);
    if (isNaN(userId)) {
        throw new Error('Invalid User ID');
    }

    try {
        const result = await session.run(
            `MATCH (u)-[:LIKES]->(e:${entityType})
            WHERE ID(u) = $userId
            RETURN {entity: e, id: ID(e)} as data`,
            { userId }
        );

        console.log(result);
        const entities = result.records.map(record => record.get('data'));
        const data = await processGets(entities); // Await the processGets call if necessary
        return data;
    } finally {
        await session.close();
    }
};

exports.getLikesOfReview = async (userId, reviewId) => {
    return getLikes(userId, reviewId, 'Review');
};

exports.getLikesOfComment = async(userId, commentId) => {
    return getLikes(userId, commentId, 'Comment');
};

exports.getLikesOfMovie = async (userId, movieId) => {
    return getLikes(userId, movieId, 'Movie');
};

exports.getLikesOfPost = async (userId, postId) => {
    return getLikes(userId, postId, 'Post');
};

async function toggleLike(userId, entityId, entityType) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u), (e)
            WHERE ID(u) = $userId AND ID(e) = $entityId
            MATCH (u)-[like:LIKES]->(e)
            RETURN like`,
            { userId, entityId }
        );

        if (result.records.length > 0) {
            await session.run(
                `MATCH (u), (e)
                WHERE ID(u) = $userId AND ID(e) = $entityId
                MATCH (u)-[like:LIKES]->(e)
                DETACH DELETE like`,
                { userId, entityId }
            );
            return false; // Like removed
        } else {
            await session.run(
                `MATCH (u), (e)
                WHERE ID(u) = $userId AND ID(e) = $entityId
                MERGE (u)-[:LIKES]->(e)`,
                { userId, entityId }
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

exports.toggleLikeReview = async (userId, reviewId) => {
    return toggleLike(userId, reviewId, 'Review');
};

exports.toggleLikeComment = async(userId, commentId) => {
    return toggleLike(userId, commentId, 'Comment');
};

exports.toggleLikeMovie = async (userId, movieId) => {
    return toggleLike(userId, movieId, 'Movie');
};

exports.toggleLikePost = async (userId, postId) => {
    return toggleLike(userId, postId, 'Post');
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