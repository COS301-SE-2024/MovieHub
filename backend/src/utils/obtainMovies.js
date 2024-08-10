const fs = require('fs');
const csv = require('csv-parser');

// Input CSV file path
const inputCSVFile = 'TMDB_movie_dataset_v11.csv';
// Output bulk JSON file path
const outputBulkFile = 'bulk_output.json';

const results = [];
const writeStream = fs.createWriteStream(outputBulkFile);

fs.createReadStream(inputCSVFile)
  .pipe(csv())
  .on('data', (row) => {
    // Transform CSV row into Elasticsearch bulk format
    const bulkIndexAction = {
      index: {
        _id: row['id'] // Use 'id' from CSV as the document ID
      }
    };
    const document = {
      title: row['title'],
      keywords: row['keywords'],
      overview: row['overview'],
      adult: row['adult'] === 'true', // Convert 'true'/'false' strings to boolean
      tagline: row['tagline'],
      spokenLanguages: row['spoken_languages'],
      genres: row['genres']
    };

    // Write action and document to the bulk file
    writeStream.write(JSON.stringify(bulkIndexAction) + '\n');
    writeStream.write(JSON.stringify(document) + '\n');
  })
  .on('end', () => {
    writeStream.end();
    console.log('CSV file successfully processed and bulk JSON file created.');
  });
