// explore.service.js
const neo4j = require('neo4j-driver'); // Import Neo4j driver
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

// Fetch friends' posts and reviews
exports.fetchFriendsContent = async (userId) => {
    const query = `
      MATCH (u:User)-[:FOLLOWS]->(friend:User)
      WHERE u.uid = $userId
      OPTIONAL MATCH (friend)-[:REVIEWED]->(review:Review)-[:REVIEWED_ON]->(movie:Movie)
      OPTIONAL MATCH (friend)-[:POSTED]->(post:Post)
      RETURN friend, post, review, movie
    `;

    try {
        const result = await session.run(query, { userId });
        const friendsContent = result.records.map(record => ({
            friend: record.get('friend').properties,
            post: record.get('post') ? record.get('post').properties : null,
            review: record.get('review') ? record.get('review').properties : null,
            movie: record.get('movie') ? record.get('movie').properties : null
        }));
        return friendsContent;
    } catch (error) {
        console.error('Error fetching friends content:', error);
        throw new Error('Failed to fetch friends content');
    }
};

// Fetch friends of friends' posts and reviews
exports.fetchFriendsOfFriendsContent = async (userId) => {
    const query = `
      MATCH (u:User)-[:FOLLOWS]->(friend:User)-[:FOLLOWS]->(fof:User)
      WHERE u.uid = $userId AND NOT (u)-[:FOLLOWS]->(fof)
      OPTIONAL MATCH (fof)-[:REVIEWED]->(review:Review)-[:REVIEWED_ON]->(movie:Movie)
      OPTIONAL MATCH (fof)-[:POSTED]->(post:Post)
      RETURN fof, post, review, movie
    `;

    try {
        const result = await session.run(query, { userId });
        const friendsOfFriendsContent = result.records.map(record => ({
            fof: record.get('fof').properties,
            post: record.get('post') ? record.get('post').properties : null,
            review: record.get('review') ? record.get('review').properties : null,
            movie: record.get('movie') ? record.get('movie').properties : null
        }));
        return friendsOfFriendsContent;
    } catch (error) {
        console.error('Error fetching friends of friends content:', error);
        throw new Error('Failed to fetch friends of friends content');
    }
};

// Fetch random users' posts
exports.fetchRandomUsersContent = async (userId) => {
    const query = `
      MATCH (currentUser:User {uid: $userId})
      MATCH (u:User)-[:POSTED]->(post:Post)
      WHERE NOT u = currentUser
      AND NOT (currentUser)-[:FOLLOWS]->(u)
      AND NOT EXISTS {
        MATCH (currentUser)-[:FOLLOWS]->(:User)-[:FOLLOWS]->(u)
      }
      RETURN u, post
      ORDER BY rand()
      LIMIT 10
    `;

    try {
        const result = await session.run(query, { userId });
        const randomUsersContent = result.records.map(record => ({
            user: record.get('u').properties,
            post: record.get('post').properties,
        }));
        return randomUsersContent;
    } catch (error) {
        console.error('Error fetching random users content:', error);
        throw new Error('Failed to fetch random users content');
    }
};


// Find other users
exports.findOtherUsers = async (userId) => {
    const query = `
      MATCH (u:User)-[:FOLLOWS]->(friend:User)-[:FOLLOWS]->(fof:User)
      WHERE u.uid = $userId AND NOT (u)-[:FOLLOWS]->(fof)
      RETURN DISTINCT fof
    `;

    try {
        const result = await session.run(query, { userId });
        const otherUsers = result.records.map(record => record.get('fof').properties);
        return otherUsers;
    } catch (error) {
        console.error('Error finding other users:', error);
        throw new Error('Failed to find other users');
    }
};

// Fetch latest posts
exports.fetchLatestPosts = async () => {
    const query = `
      MATCH (u:User)-[:POSTED]->(post:Post)
      RETURN u, post
      ORDER BY post.createdAt DESC
      LIMIT 10
    `;

    try {
        const result = await session.run(query);
        const latestPosts = result.records.map(record => ({
            user: record.get('u').properties,
            post: record.get('post').properties,
        }));
        return latestPosts;
    } catch (error) {
        console.error('Error fetching latest posts:', error);
        throw new Error('Failed to fetch latest posts');
    }
};

// Fetch top reviews
exports.fetchTopReviews = async () => {
    const query = `
      MATCH (u:User)-[:REVIEWED]->(r:Review)-[:REVIEWED_ON]->(m:Movie)
      RETURN r, u, m
      ORDER BY r.rating DESC
      LIMIT 10
    `;

    try {
        const result = await session.run(query);
        const topReviews = result.records.map(record => ({
            review: record.get('r').properties,
            user: record.get('u').properties,
            movie: record.get('m').properties,
        }));
        return topReviews;
    } catch (error) {
        console.error('Error fetching top reviews:', error);
        throw new Error('Failed to fetch top reviews');
    }
};