const fs = require('fs');

// Load the input files
const updatedBulkOutput = fs.readFileSync('updated_bulk_output.json', 'utf-8').split('\n').filter(Boolean);
const bulkOutput = fs.readFileSync('bulk_output.json', 'utf-8').split('\n').filter(Boolean);

// Convert the genre map to easily lookup IDs by genre name
const genresMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

// Create a reverse lookup of genres to IDs
const genresToIds = Object.fromEntries(Object.entries(genresMap).map(([id, name]) => [name, Number(id)]));

// Helper function to get the genre IDs
const getGenreIds = (genreString) => {
    const genres = genreString.split(',').map(genre => genre.trim());
    return genres.map(genre => genresToIds[genre]).filter(id => id !== undefined);
};

// Create a map of movies from bulk_output.json with _id as the key
const bulkMovieMap = {};
for (let i = 0; i < bulkOutput.length; i += 2) {
    const id = JSON.parse(bulkOutput[i]).index._id;
    const movie = JSON.parse(bulkOutput[i + 1]);
    bulkMovieMap[id] = movie;
}

// Process updated_bulk_output.json
const output = [];
for (let i = 0; i < updatedBulkOutput.length; i += 2) {
    const indexEntry = JSON.parse(updatedBulkOutput[i]);
    const movieEntry = JSON.parse(updatedBulkOutput[i + 1]);

    const movieId = indexEntry.index._id;
    const bulkMovie = bulkMovieMap[movieId];

    if (bulkMovie) {
        // Add poster_path from bulk_output.json
        movieEntry.poster_path = bulkMovie.poster_path;

        // Add genre_ids based on the genre map
        movieEntry.genre_ids = getGenreIds(movieEntry.genres);
    }

    // Push the updated entries in the same format
    output.push(JSON.stringify(indexEntry));
    output.push(JSON.stringify(movieEntry));
}

// Write the output to a new file
fs.writeFileSync('merged_output.json', output.join('\n'), 'utf-8');

console.log('File merged_output.json has been created successfully.');
