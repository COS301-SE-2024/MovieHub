import { searchMoviesFuzzy } from "./elasticSearchClient";
import {  getMovieByQuote } from "./quoteSearching.services";


  exports.searchMoviesFuzzy = async (req, res) => {
    try {
        const { query } = req.body;
      const movies = await searchMoviesFuzzy(query);
      res.status(200).json({ message: 'Movies fetched successfully', movies });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  exports.getMovieByQuote = async (req, res) => {
    try {
        const { quote } = req.body;
      const movies = await getMovieByQuote(quote);
      res.status(200).json({ message: 'Movies fetched successfully', movies });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };