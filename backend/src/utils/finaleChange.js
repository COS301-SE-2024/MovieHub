const fs = require('fs');

// Read the updated movie data from the file
const updatedData = fs.readFileSync('updated_movies_with_credits.json', 'utf-8');
const updatedMovies = updatedData.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines

// Read the bulk data from the file
const data = fs.readFileSync('bulk_output.json', 'utf-8');
const bulkData = data.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines

// Function to process the bulk data and update movies with credits
const processMovies = () => {
  let updatedBulkMovies = [];

  // Create a map for easy access to credits
  const creditsMap = {};
  
  // Process the updated movies to create a credits map
  for (let i = 0; i < updatedMovies.length; i++) {
    const movie = JSON.parse(updatedMovies[i]);
    creditsMap[movie.title] = movie.credits; // Use the movie title as the key
  }

  // Iterate in pairs (index action + document)
  for (let i = 0; i < bulkData.length; i += 2) {
    const indexAction = JSON.parse(bulkData[i]); // Parse index action (metadata)
    const document = JSON.parse(bulkData[i + 1]); // Parse document (actual movie data)

    const movieTitle = document.title;

    // Check if credits exist for the movie title
    if (creditsMap[movieTitle]) {
      // Add the credits to the movie document
      document.credits = creditsMap[movieTitle];

      // Log updated document for review
      console.log('Updated Movie Document:', document);

      // Push the updated movie document into the updatedBulkMovies array
      updatedBulkMovies.push(JSON.stringify(indexAction)); // Push index action
      updatedBulkMovies.push(JSON.stringify(document)); // Push updated document
    } else {
      console.error(`No credits found for movie: ${movieTitle}`);
    }
  }

  return updatedBulkMovies;
};

// Main execution function
const writeUpdatedMovies = () => {
  const updatedBulkMovies = processMovies();

  // Write the updated movie data to a new file
  const output = updatedBulkMovies.join('\n') + '\n';
  fs.writeFileSync('updated_bulk_output.json', output, 'utf-8');
  console.log('Updated movie data with credits written to updated_bulk_output.json');
};

// Run the execution
writeUpdatedMovies();
