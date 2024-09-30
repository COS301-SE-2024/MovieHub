const fs = require('fs');
const axios = require('axios');

// Read TMDB API key from environment variables
//const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Define TMDB API URL for fetching credits
const TMDB_CREDITS_API = (movieId) => `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=280e411d2e778fce1a8e91265c5b6e15`;

// Read the bulk data from the file
const data = fs.readFileSync('bulk_output.json', 'utf-8');
const bulkData = data.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines

// Function to fetch movie credits from TMDB
const fetchMovieCredits = async (movieId) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=280e411d2e778fce1a8e91265c5b6e15`);
    const credits = await response.json();

    // Extract names of directors and actors
    const directors = credits.cast
      .filter((person) => person.known_for_department === 'Directing')
      .map((person) => person.name)
      .join(', '); // Combine director names into a string

    const actors = credits.cast
      .slice(0, 10) // Get top 5 actors
      .map((actor) => actor.name)
      .join(', '); // Combine actor names into a string

    return `${directors ? `Directors: ${directors}` : ''}${
      actors ? ` | Actors: ${actors}` : ''
    }`; // Combine into one string
  } catch (error) {
    console.error(`Error fetching credits for movieId ${movieId}:`, error.message);
    return null; // Return null on error
  }
};

// Function to process the bulk data and update movies with credits
const processMovies = async () => {
  let updatedMovies = [];

  // Iterate in pairs (index action + document)
  for (let i = 0; i < bulkData.length; i += 2) {
    const indexAction = JSON.parse(bulkData[i]); // Parse index action (metadata)
    const document = JSON.parse(bulkData[i + 1]); // Parse document (actual movie data)

    const movieId = indexAction.index._id;

    if (movieId) {
      // Fetch the credits for the movie from TMDB
      const credits = await fetchMovieCredits(movieId);

      if (credits) {
        // Add the credits to the movie document as a string
        document.credits = credits;

        // Log updated document for review
        console.log('Updated Movie Document:', document);

        // Push the updated movie document into the updatedMovies array
        updatedMovies.push(document); // Push updated document
      }
    } else {
      console.error(`Missing movieId for document:`, document);
    }
  }

  return updatedMovies;
};

// Main execution function
(async () => {
  const updatedMovies = await processMovies();

  // Write the updated movie data to a new file
  const output = updatedMovies.map((item) => JSON.stringify(item)).join('\n') + '\n';
  fs.writeFileSync('updated_movies_with_credits.json', output, 'utf-8');
  console.log('Updated movie data with credits written to updated_movies_with_credits.json');
})();
