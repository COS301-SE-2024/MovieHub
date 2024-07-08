const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

//POSTS//

exports.addPost = async (userId, movieId, text, isReview, rating, postTitle) => {
    console.log("In Services: ");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u), (m)
             WHERE ID(u) = $userId AND ID(m) = $movieId
             CREATE (r:Post {isReview: $isReview, rating: $rating, text: $text, createdAt: datetime(), updatedAt: datetime(), userId: $userId, movieId: $movieId, postTitle: $postTitle})
             CREATE (u)-[:POSTED]->(r)-[:POSTED_ON]->(m)
             RETURN r`,
            { userId, movieId, text,isReview, rating, postTitle }
        );
        //.log(result.summary);
        console.log("The Result " + result.summary)
        return result.records[0].get('r').properties;

    } finally {
        await session.close();
    }
};

exports.addCommentToPost = async (userId, postId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u), (r)
             WHERE ID(u) = $userId AND ID(r) = $postId
             CREATE (c:Comment { text: $text, movieId: r.movieId, createdAt: datetime(), updatedAt: datetime(), userId: $userId, postId: $postId})
             CREATE (u)-[:COMMENTED]->(c)-[:COMMENTED_ON]->(r)
             RETURN c`,
            { userId, postId, text }
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
             CREATE (n:Comment {parentCommentId: $commentId, text: $text, movieId: c.movieId, createdAt: datetime(), updatedAt: datetime(), userId: $userId, postId: c.postId})
             CREATE (u)-[:COMMENTED]->(n)-[:COMMENTED_ON]->(c)
             RETURN n`,
            { userId, commentId, text }
        );
        return result.records[0].get('n').properties;
    } finally {
        await session.close();
    }
};

//PUTS//

exports.editPost = async (postId, text) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r)
             WHERE ID(r) = $postId
             SET r.text = $text, r.updatedAt = datetime()
             RETURN r`,
            { postId, text }
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

//DELETES//

exports.removePost = async (postId) => {
    const session = driver.session();
    try {
        await session.run(
            `MATCH (r)
             WHERE ID(r) = $postId
             DETACH DELETE r`,
            { postId }
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

//GETS//

exports.getPostsOfMovie = async (movieId) => {
    const session = driver.session();
    movieId = parseInt(movieId, 10);
    if (isNaN(movieId)) {
        throw new Error('Invalid movie ID');
    }
    try {
        const result = await session.run(
            `MATCH (m)<-[:POSTED_ON]-(r:Post)
             WHERE ID(m) = $movieId
            RETURN {post : r, id : ID(r)} as data`,
            { movieId }
        );
        if (result.records.length === 0) {
            return null;
        }
        const  reviews = result.records.map(record => record.get('data'));
        const data = await processGets(reviews); // Await the processGets call
        return data;
    } finally {
        await session.close();
    }
};

exports.getReviewsOfMovie = async (movieId) => {
    const session = driver.session();
    movieId = parseInt(movieId, 10);
    if (isNaN(movieId)) {
        throw new Error('Invalid movie ID');
    }
    try {
        const isReview = true;
        const result = await session.run(
            `MATCH (m)<-[:POSTED_ON]-(r:Post) 
             WHERE ID(m) = $movieId AND r.isReview = $isReview
             RETURN {post : r, id : ID(r)} as data`,
            { movieId, isReview}
        );
        if (result.records.length === 0) {
            return null;
        }
        const  reviews = result.records.map(record => record.get('data'));
        const data = await processGets(reviews); // Await the processGets call
        return data;
        
    } finally {
        await session.close();
    }
};

exports.getCommentsOfPost = async (postId) => {
    const session = driver.session();
    postId = parseInt(postId, 10);
    if (isNaN(postId)) {
        throw new Error('Invalid post ID');
    }
    try {
        const result = await session.run(
            `MATCH (r)<-[:COMMENTED_ON]-(c:Comment)
             WHERE ID(r) = $postId
             RETURN {post : c, id : ID(c)} as data`,
            { postId }
        );
        if (result.records.length === 0) {
            return null;
        }
        const  reviews = result.records.map(record => record.get('data'));
        const data = await processGets(reviews); // Await the processGets call
        return data;
    } finally {
        await session.close();
    }
};

exports.getPostsOfUser = async (userId) => {
    const session = driver.session();
    userId = parseInt(userId, 10);
    if (isNaN(userId)) {
        throw new Error('Invalid User ID');
    }
    try {
        const result = await session.run(
            `MATCH (u)-[:POSTED]->(r:Post)
             WHERE ID(u) = $userId
             RETURN {post : r, id : ID(r)} as data`,
            { userId }
        );
        const  reviews = result.records.map(record => record.get('data'));
        const data = await processGets(reviews); // Await the processGets call
        return data;
        } finally {
        await session.close();
    }
};

exports.getReviewsOfUser = async (userId) => {
    const session = driver.session();
    userId = parseInt(userId, 10);
    if (isNaN(userId)) {
        throw new Error('Invalid User ID');
    }
    try {
        const isReview = true;
        const result = await session.run(
            `MATCH (u)-[:POSTED]->(r:Post)
             WHERE ID(u) = $userId AND r.isReview = $isReview
             RETURN {post : r, id : ID(r)} as data`,
            { userId, isReview }
        );
        const  reviews = result.records.map(record => record.get('data'));
        const data = await processGets(reviews); // Await the processGets call
        return data;

    } finally {
        await session.close();
    }
};

exports.getCommentsOfUser = async (userId) => {
    const session = driver.session();
    userId = parseInt(userId, 10);
    if (isNaN(userId)) {
        throw new Error('Invalid User ID');
    }
    try {
        const result = await session.run(
            `MATCH (u)-[:COMMENTED]->(c:Comment)
            WHERE ID(u) = $userId
            RETURN {post : c, id : ID(c)} as data`,
            { userId }
        );
        const  reviews = result.records.map(record => record.get('data'));
        const data = await processGets(reviews); // Await the processGets call
        return data;
    } finally {
        await session.close();
    }
};

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
  