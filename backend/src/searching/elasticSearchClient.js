const { Client } = require('@elastic/elasticsearch');
const neo4j = require('neo4j-driver');
require('dotenv').config();

// Define the Elasticsearch nodes
const esNodes = [
  'http://localhost:9200', // es01
  'http://localhost:9201', // es02
  'http://localhost:9202'  // es03
];

// Create the Elasticsearch client
const client = new Client({ nodes: esNodes });

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);


// Test the connection
async function checkConnection() {
  try {
    const health = await client.cluster.health();
    console.log('Connected to Elasticsearch cluster:', health);
  } catch (err) {
    console.error('Could not connect to Elasticsearch cluster:', err);
  }
}

exports.searchMoviesFuzzy = async (query) => {


  try {
    const response = await client.search({
      index: 'movies', // Assuming your index is named 'movies'
      body: {
        query: {
          multi_match: {
            query: query,
            fields: [
              'title^2',
              'tagline',
              'keywords^1.5',
              'overview',
              'credits^2.1'
            ],
            fuzziness: 'AUTO',
          }
        },
        size: 30 // Increase the number of results returned
      }
    });

    // Sort the movies by adjusted score
    const sortedMovies = response.body.hits.hits.map(hit => {
      const popularity = hit._source.popularity || 0;
      const adjustedScore = hit._score * (1 + (popularity / 100));
      return { ...hit, adjustedScore }; // Add adjustedScore to each hit
    }).sort((a, b) => b.adjustedScore - a.adjustedScore);
    console.log(sortedMovies);
    // Extract and return the relevant data
    return sortedMovies;
  } catch (error) {
    console.error('Error searching for movies:', error.meta.body.error); // More detailed error log
    throw error;
  }
};


exports.searchRecentMoviesByGenres = async (uid) => {

  const session = driver.session();
  let genres;
  try {
    const result = await session.run(
      'MATCH (u:User {uid: $uid}) RETURN u',
      { uid }
    );

    if (result.records.length === 0) {
      return null;
    }
    genres = result.records[0].get('u').properties;
    genres = genres.favouriteGenres;
    //genres = genres[0] + ' ' + genres[1] + ' ' + genres[2];
    console.log(genres);
  } finally {
    await session.close();
  }

  try {

    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 3;

    const response = await client.search({
      index: 'movies', // Assuming your index is named 'movies'
      body: {
        query: {
          bool: {
            filter: [
              {
                range: {
                  "releaseDate": {
                    gte: fiveYearsAgo,
                    lte: currentYear
                  }
                }
              }
            ],
            should: genres.map((genre) => ({
              match: {
                genres: genre // Matching each genre provided
              }
            }))
          }
        },
        size: 30 // Increase the number of results returned
      }
    });

    return response.body.hits.hits;
  } catch (error) {
    console.error('Error searching for movies:', error.meta.body.error); // More detailed error log
    throw error;
  }
};

