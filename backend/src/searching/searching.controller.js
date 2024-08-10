import { searchMoviesFuzzy } from "./elasticSearchClient";

exports.checkConnection = async (req, res) => {
    try {
      const movies = await checkConnection();
      res.status(200).json({ message: 'Movies fetched successfully', movies });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  exports.searchMoviesFuzzy = async (req, res) => {
    try {
        const { query } = req.body;
      const movies = await searchMoviesFuzzy(query);
      res.status(200).json({ message: 'Movies fetched successfully', movies });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };