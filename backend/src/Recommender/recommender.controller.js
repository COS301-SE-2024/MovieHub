// backend/src/recommender/recommender.controller.js
const { recommendMoviesByTMDBId } = require('./recommender.service');

const getRecommendations = async (req, res) => {
    try {
        const { tmdbId, userId } = req.params;
        console.log("In the Rec Controller");
        const recommendations = await recommendMoviesByTMDBId(tmdbId, userId);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRecommendations
};
