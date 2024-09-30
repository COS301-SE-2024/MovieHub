const express = require('express');
const { getGameData } = require('./games.services'); // Ensure the path is correct
const router = express.Router();

// Route to get game data by genre
router.get('/:genre', async (req, res) => {
    console.log("Get game data by genre called");
    const genre = req.params.genre;
    try {
        const gameData = await getGameData(genre); // Call the service function
        res.json(gameData); // Send the game data as JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
});

module.exports = router;