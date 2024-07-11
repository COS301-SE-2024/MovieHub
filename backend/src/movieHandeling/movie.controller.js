const movieService = require('./movie.services');

exports.checkMovieExistence = async (req, res) => {
    const { movieId } = req.params;
    try {
        const exists = await movieService.movieExists(movieId);
        res.status(200).json({ exists });
    } catch (error) {
        res.status(500).json({ message: 'Error checking movie existence', error: error.message });
    }
};

exports.createMovie = async (req, res) => {
    const { movieId } = req.body;
    try {
        await movieService.addMovie(movieId);
        res.status(201).json({ message: 'Movie created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding movie', error: error.message });
    }
};

exports.fetchMovieDetails = async (req, res) => {
    const { movieId } = req.params;
    try {
        const movie = await movieService.getMovieDetails(movieId);
        res.status(200).json({ movie });
    } catch (error) {
        res.status(500).json({ message: 'Error getting movie details', error: error.message });
    }
};

exports.fetchMoviesByActor = async (req, res) => {
    const { actorName } = req.params;
    try {
        const movies = await movieService.getMovieByActor(actorName);
        res.status(200).json({ movies });
    } catch (error) {
        res.status(500).json({ message: 'Error getting movies by actor', error: error.message });
    }
};

exports.fetchMoviesByGenre = async (req, res) => {
    const { genre } = req.params;
    try {
        const movies = await movieService.getMoviesByGenre(genre);
        res.status(200).json({ movies });
    } catch (error) {
        res.status(500).json({ message: 'Error getting movies by genre', error: error.message });
    }
};

exports.fetchSimilarMovies = async (req, res) => {
    const { movieId } = req.params;
    try {
        const similarMovies = await movieService.getSimilarMovies(movieId);
        res.status(200).json({ similarMovies });
    } catch (error) {
        res.status(500).json({ message: 'Error getting similar movies', error: error.message });
    }
};

exports.createRating = async (req, res) => {
    const { userId, movieId, rating } = req.body;
    try {
        await movieService.addRating(userId, movieId, rating);
        res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding rating', error: error.message });
    }
};

exports.fetchRatings = async (req, res) => {
    const { userId } = req.params;
    try {
        const ratings = await movieService.getRatings(userId);
        res.status(200).json({ ratings });
    } catch (error) {
        res.status(500).json({ message: 'Error getting ratings', error: error.message });
    }
};
