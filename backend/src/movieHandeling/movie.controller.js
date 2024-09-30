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

exports.fetchSuggestedMovies = async (req, res) => {
    const { uid } = req.params;

    try {
        const suggestedMovies = await movieService.getSuggestedMoviesForUser(uid);
        res.status(200).json({ movies: suggestedMovies });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suggested movies', error: error.message });
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


