const userService = require('./users.services');

let userProfileData;
let watchlistsData;

exports.getUserProfile = async (req, res) => {
    console.log('getUserProfile called in user.controller');
    try {
        const userId = req.params.id;
        console.log(`Fetching user profile for ID: ${userId}`);
        const userProfile = await userService.getUserProfile(userId);

        if (userProfile) {
            userProfileData = userProfile;

            console.log('User profile username ' + userProfile.username);
            res.status(200).json(userProfile);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
    try {
        const updatedUser = await userService.updateUserProfile(userId, updates);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.deleteUserProfile = async (req, res) => {
    console.log('DeleteUserProfile called');
    const userId = req.params.id;
   try {
        console.log(`Deleting user profile for ID: ${userId}`);
        const result = await userService.deleteUserProfile(userId);
        console.log("Res in controller: ",result);
        if (result) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user profile', error: error.message });
    }
};

exports.getUserWatchlists = async (req, res) => {
    console.log('getUserWatchlists called in user.controller');
    const userId = req.params.id;

    try {
        console.log(`Fetching watchlists for user ID: ${userId}`);
        const watchlists = await userService.getUserWatchlists(userId);
        if (watchlists) {
            console.log('Watchlists: ' + watchlists.name);
            res.status(200).json(watchlists);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching watchlists:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Follow a user
exports.followUser = async (req, res) => {
    const { followerId, followeeId } = req.body;
    if (!followerId || !followeeId) {
        return res.status(400).json({ message: 'Follower ID and Followee ID are required' });
    }
    try {
        const response = await userService.followUser(followerId, followeeId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Error following user', error: error.message });
    }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    const { followerId, followeeId } = req.body;
    if (!followerId || !followeeId) {
        return res.status(400).json({ message: 'Follower ID and Followee ID are required' });
    }
    try {
        const response = await userService.unfollowUser(followerId, followeeId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ message: 'Error unfollowing user', error: error.message });
    }
};

// Get friends of a user
exports.getFriends = async (req, res) => {
    const userId = req.params.id;
    try {
        const friends = await userService.getFriends(userId);
        if (friends) {
            res.status(200).json(friends);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Error fetching friends', error: error.message });
    }
};

// Get followers of a user
exports.getFollowers = async (req, res) => {
    const userId = req.params.id;
    try {
        const followers = await userService.getFollowers(userId);
        res.status(200).json(followers);
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ message: 'Error fetching followers', error: error.message });
    }
};

// Get users that a user is following
exports.getFollowing = async (req, res) => {
    const userId = req.params.id;
    try {
        const following = await userService.getFollowing(userId);
        res.status(200).json(following);
    } catch (error) {
        console.error('Error fetching following users:', error);
        res.status(500).json({ message: 'Error fetching following users', error: error.message });
    }
};

exports.fetchFollowerCount = async (req, res) => {
    const { userId } = req.params;

    try {
        const followerCount = await userService.getFollowerCount(userId);
        res.status(200).json({ followerCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching follower count', error: error.message });
    }
};

exports.fetchFollowingCount = async (req, res) => {
    const { userId } = req.params;

    try {
        const followingCount = await userService.getFollowingCount(userId);
        res.status(200).json({ followingCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching following count', error: error.message });
    }
};

exports.getUserNotifications = async (req, res) => {
    const userId = req.params.id;

    try {
        const notifications = await userService.getUserNotifications(userId);
        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
};
