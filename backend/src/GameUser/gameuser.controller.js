// games.controller.js
const { updateUserProperties } = require('./gameuser.services'); 
const { getUserGameProfile } = require('./user.service');


const updateUser = async (req, res) => {
    const { uid, points, level, position } = req.body; 

    try {
        const updatedUser = await updateUserProperties(uid, points, level, position);
        return res.status(200).json({ message: 'User properties updated successfully', updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user properties', error: error.message });
    }
};

module.exports = {
    updateUser,
};

exports.fetchUserProfile = async (req, res) => {
    const userId = req.params.userId; // Get userId from request parameters

    try {
        const userProfile = await getUserGameProfile(userId);

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(userProfile); // Send the profile data as a response
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Error fetching user profile' });
    }
};
