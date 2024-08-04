const { Client } = require('@elastic/elasticsearch');

// Define the Elasticsearch nodes
const esNodes = [
  'http://localhost:9200', // es01
  'http://localhost:9201', // es02
  'http://localhost:9202'  // es03
];

// Create the Elasticsearch client
const client = new Client({ nodes: esNodes });

// Test the connection
async function checkConnection() {
  try {
    const health = await client.cluster.health();
    console.log('Connected to Elasticsearch cluster:', health);
  } catch (err) {
    console.error('Could not connect to Elasticsearch cluster:', err);
  }
};


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
                'keywords',
                'overview',
                'spokenLanguages',
                'genre'
              ],
              fuzziness: 'AUTO',
            }
          }
        }
      });

     // Extract and return the relevant data
     return response.body.hits.hits.map(hit => hit);
    } catch (error) {
      console.error('Error searching for movies:', error.meta.body.error); // More detailed error log
      throw error;
    }
  };
