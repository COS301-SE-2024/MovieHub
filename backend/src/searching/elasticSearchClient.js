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
              'title^1.5',
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

    const filteredMovies = response.body.hits.hits.filter(hit => {
      //console.log(hit);
      const { keywords, overview, genre, tagline } = hit._source;
      console.log(hit._source);
      // Check if any of the fields contain the word "next"
      return (
        (keywords && keywords.trim().length > 0) ||
        (overview && overview.trim().length > 0) ||
        (genre && genre.trim().length > 0) ||
        (tagline && tagline.trim().length > 0)
      );
    });

    const sortedMovies = filteredMovies.sort((a, b) => {
      const aSource = a._source;
      const bSource = b._source;

      // Count filled fields for a and b
      const aFilledFields = ['keywords', 'overview', 'genre', 'tagline']
        .filter(field => aSource[field] && aSource[field].trim().length > 0).length;
      const bFilledFields = ['keywords', 'overview', 'genre', 'tagline']
        .filter(field => bSource[field] && bSource[field].trim().length > 0).length;

      // If both movies have the same number of filled fields, sort by total text length
      if (aFilledFields === bFilledFields) {
        const aTotalLength = ['keywords', 'overview', 'genre', 'tagline']
          .reduce((sum, field) => sum + (aSource[field] ? aSource[field].trim().length : 0), 0);
        const bTotalLength = ['keywords', 'overview', 'genre', 'tagline']
          .reduce((sum, field) => sum + (bSource[field] ? bSource[field].trim().length : 0), 0);

        return bTotalLength - aTotalLength; // Sort by length (descending)
      }

      // Sort by the number of filled fields (descending)
      return bFilledFields - aFilledFields;
    });


    // Extract and return the relevant data
    return sortedMovies;
  } catch (error) {
    console.error('Error searching for movies:', error.meta.body.error); // More detailed error log
    throw error;
  }
};
