const fs = require('fs');
const csv = require('csv-parser');

// Input CSV file path
const inputCSVFile = 'TMDB_movie_dataset_v11.csv';
// Output bulk JSON file path
const outputBulkFile = 'bulk_output.json';

const writeStream = fs.createWriteStream(outputBulkFile);

// Function to check for unwanted words in text fields
const containsUnwantedWords = (text) => {
  const lowerCaseText = text ? text.toLowerCase() : '';
  return lowerCaseText.includes('pornography') || lowerCaseText.includes('porn') || lowerCaseText.includes('nude')
    || lowerCaseText.includes('anal') || lowerCaseText.includes('cock') || lowerCaseText.includes('porn:')
    || lowerCaseText.includes('vagina') || lowerCaseText.includes('fingering')
    || lowerCaseText.includes('boobs') || lowerCaseText.includes('tits')
    || lowerCaseText.includes('titty') || lowerCaseText.includes('orgy')
    || lowerCaseText.includes('masterbation') || lowerCaseText.includes('penis')
    || lowerCaseText.includes('cum') || lowerCaseText.includes('sex')
    || lowerCaseText.includes('fuck') || lowerCaseText.includes('Wicked Pictures')
    || lowerCaseText.includes('intercourse')|| lowerCaseText.includes('gloryhole');
};

// Process the CSV file
fs.createReadStream(inputCSVFile)
  .pipe(csv())
  .on('data', (row) => {
    // Extract fields from the CSV row
    const { title, keywords, overview, tagline, genres } = row;

    // Check if the movie should be filtered out
    if (
      !containsUnwantedWords(title) &&
      !containsUnwantedWords(keywords) &&
      !containsUnwantedWords(overview) &&
      !containsUnwantedWords(genres) &&
      !containsUnwantedWords(tagline) &&
      (title && title.trim().length > 0) &&
      (keywords && keywords.trim().length > 0) &&
      (overview && overview.trim().length > 0) &&
      (genres && genres.trim().length > 0) &&
      (tagline && tagline.trim().length > 0)
    ) {
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
        tagline: row['tagline'],
        releaseDate: row['release_date'],
        popularity: row['popularity'],
        spokenLanguages: row['spoken_languages'],
        poster_path:row['poster_path'],
        genres: row['genres']
      };

      // Write action and document to the bulk file
      writeStream.write(JSON.stringify(bulkIndexAction) + '\n');
      writeStream.write(JSON.stringify(document) + '\n');
    }
  })
  .on('end', () => {
    writeStream.end();
    console.log('CSV file successfully processed and bulk JSON file created.');
  });
