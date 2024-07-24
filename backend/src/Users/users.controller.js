// backend/users/users.controller.js
// const express = require('express');
// const path = require('path');
const userService = require('./users.services');

let userProfileData;
let watchlistsData;

// exports.getUserProfile = async (req, res) => {
//     const userId = req.params.userId;
//     try {
//         const user = await userService.getUserProfile(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving user profile', error });
//     }
// };

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

//console.log('User profile username: ' + userProfileData);

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
        console.log(result);
        if (result.success) {
            res.status(200).json({ message: 'User deleted successfully' });
           // console.log(`'User deleted successfully'`);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user profile', error: error.message });
    }
};


exports.getUserWatchlists = async (req, res) => {
    const userId  = req.params.id;

    try {
        const watchlists = await userService.getUserWatchlists(userId);
        if (watchlists) {
            watchlistsData = watchlists

            console.log('Watchlists' + watchlists.name);
            res.status(200).json(watchlists);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
      //  res.status(200).json(watchlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Follow a user
exports.followUser = async (req, res) => {
    const { followerId, followeeId } = req.body;
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
        res.status(200).json(friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Error fetching friends', error: error.message });
    }
};