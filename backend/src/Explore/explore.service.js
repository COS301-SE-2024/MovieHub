// explore.service.js
const neo4j = require('neo4j-driver'); // Import Neo4j driver
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

class ExploreService {
    // Fetch friends' posts and reviews
    async fetchFriendsContent(userId) {
        const query = `
      MATCH (u:User)-[:FOLLOWS]->(friend:User)
      WHERE u.uid = $userId
      OPTIONAL MATCH (friend)-[:POSTED]->(post:Post)
      OPTIONAL MATCH (post)-[:HAS_REVIEW]->(review:Review)
      RETURN friend, post, review
    `;

        try {
            const result = await session.run(query, { userId });
            const friendsContent = result.records.map(record => ({
                friend: record.get('friend').properties,
                post: record.get('post') ? record.get('post').properties : null,
                review: record.get('review') ? record.get('review').properties : null,
            }));
            return friendsContent;
        } catch (error) {
            console.error('Error fetching friends content:', error);
            throw new Error('Failed to fetch friends content');
        }
    }

    // Fetch friends of friends' posts and reviews
    async fetchFriendsOfFriendsContent(userId) {
        const query = `
      MATCH (u:User)-[:FOLLOWS]->(friend:User)-[:FOLLOWS]->(fof:User)
      WHERE u.uid = $userId
      OPTIONAL MATCH (fof)-[:POSTED]->(post:Post)
      OPTIONAL MATCH (post)-[:HAS_REVIEW]->(review:Review)
      RETURN fof, post, review
    `;

        try {
            const result = await session.run(query, { userId });
            const friendsOfFriendsContent = result.records.map(record => ({
                fof: record.get('fof').properties,
                post: record.get('post') ? record.get('post').properties : null,
                review: record.get('review') ? record.get('review').properties : null,
            }));
            return friendsOfFriendsContent;
        } catch (error) {
            console.error('Error fetching friends of friends content:', error);
            throw new Error('Failed to fetch friends of friends content');
        }
    }

    // Fetch random users' posts
    async fetchRandomUsersContent() {
        const query = `
      MATCH (u:User)-[:POSTED]->(post:Post)
      RETURN u, post
      ORDER BY rand()
      LIMIT 10
    `;

        try {
            const result = await session.run(query);
            const randomUsersContent = result.records.map(record => ({
                user: record.get('u').properties,
                post: record.get('post').properties,
            }));
            return randomUsersContent;
        } catch (error) {
            console.error('Error fetching random users content:', error);
            throw new Error('Failed to fetch random users content');
        }
    }

    // Find other users
    async findOtherUsers(userId) {
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
    }
}

module.exports = new ExploreService();
