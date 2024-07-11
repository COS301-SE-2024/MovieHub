const actorService = require('./actor.services');

exports.checkActorExistence = async (req, res) => {
    const { actorName } = req.params;
    try {
        const exists = await actorService.actorExist(actorName);
        res.status(200).json({ exists });
    } catch (error) {
        res.status(500).json({ message: 'Error checking actor existence', error: error.message });
    }
};

exports.createActor = async (req, res) => {
    const { actorName } = req.body;
    try {
        await actorService.addActor(actorName);
        res.status(201).json({ message: 'Actor created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding actor', error: error.message });
    }
};

exports.assignMovieToActor = async (req, res) => {
    const { actorName, movieId } = req.body;
    try {
        await actorService.addMovieToActor(actorName, movieId);
        res.status(201).json({ message: 'Movie added to actor successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding movie to actor', error: error.message });
    }
};

exports.fetchMoviesByActor = async (req, res) => {
    const { actorName } = req.params;
    try {
        const movies = await actorService.getMoviesByActor(actorName);
        res.status(200).json({ movies });
    } catch (error) {
        res.status(500).json({ message: 'Error getting movies by actor', error: error.message });
    }
};

exports.fetchActorsByMovie = async (req, res) => {
    const { movieId } = req.params;
    try {
        const actors = await actorService.getActorsByMovie(movieId);
        res.status(200).json({ actors });
    } catch (error) {
        res.status(500).json({ message: 'Error getting actors by movie', error: error.message });
    }
};
