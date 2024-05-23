// backend/users/users.controller.js
const userService = require('./users.services');

exports.getUserProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userService.getUserProfile(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error });
    }
};

exports.updateUserProfile = async (req, res) => {
    const userId = req.params.userId;
    const updates = req.body;
    try {
        const updatedUser = await userService.updateUserProfile(userId, updates);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error });
    }
};

exports.deleteUserProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const result = await userService.deleteUserProfile(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user profile', error });
    }
};
