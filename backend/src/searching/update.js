const fs = require('fs');

// Load the JSON data
fs.readFile('merged_output.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split the data into an array of lines
  const lines = data.split('\n');

  // Initialize an array to store the updated data
  const updatedData = [];

  for (let i = 0; i < lines.length; i += 2) {
    // Parse the index and the movie data
    const indexData = JSON.parse(lines[i]);
    const movieData = JSON.parse(lines[i + 1]);

    // Add the 'id' field from the '_id' field in the index data
    movieData.id = indexData.index._id;

    // Add the updated data back to the array
    updatedData.push(JSON.stringify(indexData));
    updatedData.push(JSON.stringify(movieData));
  }

  // Write the updated data back to a new file
  fs.writeFile('updated_merged_output.json', updatedData.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File updated successfully.');
  });
});
