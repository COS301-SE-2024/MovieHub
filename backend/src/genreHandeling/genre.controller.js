const genreService = require('./genre.services');

exports.checkGenreExistence = async (req, res) => {
    const { genre } = req.params;
    try {
        const exists = await genreService.genreExist(genre);
        res.status(200).json({ exists });
    } catch (error) {
        res.status(500).json({ message: 'Error checking genre existence', error: error.message });
    }
};

exports.createGenre = async (req, res) => {
    const { genre } = req.body;
    try {
        await genreService.addGenre(genre);
        res.status(201).json({ message: 'Genre created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding genre', error: error.message });
    }
};

exports.fetchGenres = async (req, res) => {
    try {
        const genres = await genreService.getGenres();
        res.status(200).json({ genres });
    } catch (error) {
        res.status(500).json({ message: 'Error getting genres', error: error.message });
    }
};

exports.assignGenreToMovie = async (req, res) => {
    const { genre } = req.body;
    try {
        await genreService.addGenreToMovie(genre);
        res.status(201).json({ message: 'Genre assigned to movies successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning genre to movies', error: error.message });
    }
};

exports.fetchMoviesByGenre = async (req, res) => {
    const { genre } = req.params;
    try {
        const movies = await genreService.getMoviesByGenre(genre);
        res.status(200).json({ movies });
    } catch (error) {
        res.status(500).json({ message: 'Error getting movies by genre', error: error.message });
    }
};
