const ExploreService = require('./explore.service');
const admin = require('firebase-admin');

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach the decoded token to the request
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Fetch friends' posts and reviews using user's own ID from token
exports.getFriendsContent = [
    verifyFirebaseToken,
    async (req, res) => {
        try {
            const userId = req.user.uid; // Use user ID from the verified token
            const content = await ExploreService.fetchFriendsContent(userId);
            res.status(200).json(content);
        } catch (error) {
            console.error('Error fetching friends\' content:', error);
            res.status(500).json({ error: 'Failed to fetch friends\' content' });
        }
    }
];

// Fetch friends of friends' posts and reviews
exports.getFriendsOfFriendsContent = [
    verifyFirebaseToken,
    async (req, res) => {
        try {
            const userId = req.user.uid;
            const content = await ExploreService.fetchFriendsOfFriendsContent(userId);
            res.status(200).json(content);
        } catch (error) {
            console.error('Error fetching friends of friends\' content:', error);
            res.status(500).json({ error: 'Failed to fetch friends of friends\' content' });
        }
    }
];

// Fetch random users' posts
exports.getRandomUsersContent = [
    verifyFirebaseToken,
    async (req, res) => {
        try {
            const content = await ExploreService.fetchRandomUsersContent();
            res.status(200).json(content);
        } catch (error) {
            console.error('Error fetching random users\' content:', error);
            res.status(500).json({ error: 'Failed to fetch random users\' content' });
        }
    }
];

// Find other users
exports.findUsers = [
    verifyFirebaseToken,
    async (req, res) => {
        try {
            const userId = req.user.uid;
            const users = await ExploreService.findOtherUsers(userId);
            res.status(200).json(users);
        } catch (error) {
            console.error('Error finding users:', error);
            res.status(500).json({ error: 'Failed to find users' });
        }
    }
];
