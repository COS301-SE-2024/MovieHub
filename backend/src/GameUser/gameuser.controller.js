// games.controller.js
const { updateUserProperties } = require('./gameuser.services'); 

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
