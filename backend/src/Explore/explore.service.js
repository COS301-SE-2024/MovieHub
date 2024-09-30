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
    // Function to run a query with a new session
    const runQuery = async (query, params) => {
        const session = driver.session(); // Create a new session for each query
        try {
            const result = await session.run(query, params);
            return result;
        } finally {
            await session.close(); // Close the session after query execution
        }
    };

    // Query for friends and their posts including friends' information
    const postsQuery = `
  MATCH (u:User)-[:FOLLOWS]->(friend:User)
  WHERE u.uid = $userId AND friend.uid <> $userId
  OPTIONAL MATCH (friend)-[:POSTED]->(post:Post)
  RETURN friend.uid AS friendId, friend.username AS friendUsername, friend.avatar AS friendAvatar, post
`;

    // Query for friends and their reviews including friends' information
    const reviewsQuery = `
  MATCH (u:User)-[:FOLLOWS]->(friend:User)
  WHERE u.uid = $userId AND friend.uid <> $userId
  OPTIONAL MATCH (friend)-[:REVIEWED]->(review:Review)-[:REVIEWED_ON]->(movie:Movie)
  RETURN friend.uid AS friendId, friend.username AS friendUsername, friend.avatar AS friendAvatar, review, movie
`;

    try {
        // Execute the queries with new sessions
        const [postsResult, reviewsResult] = await Promise.all([
            runQuery(postsQuery, { userId }),
            runQuery(reviewsQuery, { userId })
        ]);

        // Collect all posts with friends' information
        const posts = postsResult.records.map(record => {
            const post = record.get('post') ? record.get('post').properties : null;
            const friendInfo = {
                uid: record.get('friendId'),
                username: record.get('friendUsername'),
                avatar: record.get('friendAvatar')
            };
            return post ? { friend: friendInfo, post } : null;
        }).filter(post => post !== null);

        // Collect all reviews with friends' information
        const reviews = reviewsResult.records.map(record => {
            const review = record.get('review') ? record.get('review').properties : null;
            const movie = record.get('movie') ? record.get('movie').properties : null;
            const friendInfo = {
                uid: record.get('friendId'),
                username: record.get('friendUsername'),
                avatar: record.get('friendAvatar')
            };
            return review ? { friend: friendInfo, review, movie } : null;
        }).filter(review => review !== null);

        // Construct final result
        const friendsContent = {
            posts,
            reviews
        };

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
  WHERE u.uid = $userId AND NOT (u)-[:FOLLOWS]->(fof) AND fof.uid <> $userId
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
  AND u.uid <> $userId
  AND NOT EXISTS {
    MATCH (currentUser)-[:FOLLOWS]->(:User)-[:FOLLOWS]->(u)
  }
  RETURN u, post
  ORDER BY rand()
  LIMIT 30
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
      LIMIT 30
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
      LIMIT 30
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