#!/usr/bin/env node
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const csv = require('csv-parser');

// Initialize Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' }); // Replace with your Elasticsearch instance URL

// Define the Elasticsearch index name
const indexName = 'movies_index';

// Define the index and mapping
async function createIndex() {
  try {
    const indexExists = await client.indices.exists({ index: indexName });
    if (!indexExists) {
      await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              imdbId: { type: 'keyword' },
              title: { type: 'text' },
              keywords: { type: 'text' },
              description: { type: 'text' },
              adult: { type: 'boolean' },
              tagline: { type: 'text' },
              spokenLanguages: { type: 'text' },
              genres: { type: 'text' },
            },
          },
        },
      });
      console.log(`Index ${indexName} created.`);
    } else {
      console.log(`Index ${indexName} already exists.`);
    }
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

// Index a single movie document
async function indexMovie(movie) {
  try {
    await client.index({
      index: indexName,
      document: movie,
    });
  } catch (error) {
    console.error('Error indexing movie:', error);
  }
}

// Parse CSV and index documents
async function importMovies() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('TMDB_movie_dataset_v11.csv')
      .pipe(csv())
      .on('data', (row) => {
        const movie = {
          imdbId: row.imdb_id,
          title: row.title,
          keywords: row.keywords,
          description: row.overview,
          adult: row.adult === 'True',
          tagline: row.tagline,
          spokenLanguages: row.spoken_languages,
          genres: row.genres,
        };
        indexMovie(movie).catch((error) => console.error('Error indexing movie:', error));
      })
      .on('end', () => {
        console.log('All movies have been indexed.');
        resolve();
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Main function to create index and import movies
(async () => {
  try {
    await createIndex();
    await importMovies();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
})();
