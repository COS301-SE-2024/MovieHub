const express = require('express');
const { getGameData } = require('./games.services');

const router = express.Router();

router.get('/:genre', async (req, res) => {
    const { genre } = req.params;
    try {
        const gameData = await getGameData(genre);
        res.json(gameData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;