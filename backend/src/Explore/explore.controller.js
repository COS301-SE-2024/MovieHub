const ExploreService = require('./explore.service');

// Fetch friends' posts and reviews using user's own ID from token
exports.getFriendsContent = async (req, res) => {
    try {
       // const userId = req.user.uid; // Use user ID from the request (assumed verified)
        // Simulate getting user ID from request for testing
        const userId = req.headers['x-user-id'] || req.query.userId; // Accept user ID from header or query parameter
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }
        const content = await ExploreService.fetchFriendsContent(userId);
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching friends\' content:', error);
        res.status(500).json({ error: 'Failed to fetch friends\' content' });
    }
};

// Fetch friends of friends' posts and reviews
exports.getFriendsOfFriendsContent = async (req, res) => {
    try {
      //  const userId = req.user.uid; // Use user ID from the request (assumed verified)
        const userId = req.headers['x-user-id'] || req.query.userId; // Accept user ID from header or query parameter
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }
        const content = await ExploreService.fetchFriendsOfFriendsContent(userId);
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching friends of friends\' content:', error);
        res.status(500).json({ error: 'Failed to fetch friends of friends\' content' });
    }
};

// Fetch random users' posts
exports.getRandomUsersContent = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || req.query.userId; // Accept user ID from header or query parameter
        const content = await ExploreService.fetchRandomUsersContent(userId);
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching random users\' content:', error);
        res.status(500).json({ error: 'Failed to fetch random users\' content' });
    }
};

// Find other users
exports.findUsers = async (req, res) => {
    try {
       // const userId = req.user.uid; // Use user ID from the request (assumed verified)
        const userId = req.headers['x-user-id'] || req.query.userId; // Accept user ID from header or query parameter
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }
        const users = await ExploreService.findOtherUsers(userId);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error finding users:', error);
        res.status(500).json({ error: 'Failed to find users' });
    }
};

// Fetch latest posts
exports.getLatestPosts = async (req, res) => {
    try {
        const latestPosts = await ExploreService.fetchLatestPosts();
        res.status(200).json(latestPosts);
    } catch (error) {
        console.error('Error fetching latest posts:', error);
        res.status(500).json({ error: 'Failed to fetch latest posts' });
    }
};

// Fetch top reviews
exports.getTopReviews = async (req, res) => {
    try {
        const topReviews = await ExploreService.fetchTopReviews();
        res.status(200).json(topReviews);
    } catch (error) {
        console.error('Error fetching top reviews:', error);
        res.status(500).json({ error: 'Failed to fetch top reviews' });
    }
};