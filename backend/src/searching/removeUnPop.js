const fs = require('fs');

// Load the JSON data
fs.readFile('filtered_merged_output2.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split the data into an array of lines
  const lines = data.split('\n');

  // Initialize an array to store the updated data
  const filteredData = [];

  // Function to check if any field contains the word "spanking"
  const containsSpanking = (movieData) => {
    const fieldsToCheck = ['title', 'keywords', 'overview', 'tagline', 'spokenLanguages'];
    return fieldsToCheck.some(field => movieData[field] && movieData[field].toLowerCase().includes('incest'));
  };

  for (let i = 0; i < lines.length; i += 2) {
    // Parse the index and the movie data
    const indexData = JSON.parse(lines[i]);
    const movieData = JSON.parse(lines[i + 1]);

    // Convert popularity to a number
    const popularity = Number(movieData.popularity); // Convert popularity to a number
    const releaseYear = new Date(movieData.releaseDate).getFullYear();

    // Check if the movie's popularity is greater than 1.5, release year is 1960 or later, and does not contain the word "spanking"
    if (popularity > 5 && releaseYear >= 1960 && !containsSpanking(movieData)) {
      // Keep the movie and its index in the filtered data
      filteredData.push(JSON.stringify(indexData));
      filteredData.push(JSON.stringify(movieData));
    }
  }

  // Write the filtered data back to a new file
  fs.writeFile('3filtered_merged_output.json', filteredData.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File filtered and saved successfully.');
  });
});
