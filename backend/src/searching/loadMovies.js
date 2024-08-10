const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

// Create the Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' });

// Read the bulk data from the file
const data = fs.readFileSync('bulk_output.json', 'utf-8');
const bulkData = data.split('\n').filter(line => line.trim() !== '');

// Function to process bulk operations in batches of 2000
async function bulkIndexInBatches(operations, batchSize = 2000) {
  for (let i = 0; i < operations.length; i += batchSize * 2) {
    const batch = operations.slice(i, i + batchSize * 2);
    try {
      const bulkResponse = await client.bulk({ refresh: true, body: batch });

      // Check for errors
      if (bulkResponse.errors) {
        bulkResponse.items.forEach((item, index) => {
          const operation = item.index || item.update;
          if (operation.error) {
            console.error(`Error indexing document ${batch[index * 2 + 1]._id}:`, operation.error);
          }
        });
      } else {
        console.log(`Batch ${i / (batchSize * 2) + 1} indexed successfully`);
      }
    } catch (err) {
      console.error('Bulk indexing failed:', err);
    }
  }
}

// Prepare bulk operations
let operations = [];
for (let i = 0; i < bulkData.length; i += 2) {
  const indexAction = JSON.parse(bulkData[i]);
  const document = JSON.parse(bulkData[i + 1]);

  operations.push(
    { index: { _index: 'movies', _id: indexAction.index._id } },
    document
  );
}

// Function to delete all documents in the 'movies' index in batches of 3000
async function deleteAllMoviesInBatches(batchSize = 3000) {
  let deleted = 0;
  while (true) {
    try {
      const response = await client.search({
        index: 'movies',
        size: batchSize,
        _source: false, // Don't retrieve the full documents
        body: {
          query: {
            match_all: {}
          }
        }
      });

      const hits = response.body.hits.hits;

      if (hits.length === 0) break; // No more documents to delete

      const deleteOperations = hits.flatMap(hit => [{ delete: { _index: 'movies', _id: hit._id } }]);

      const deleteResponse = await client.bulk({ refresh: true, body: deleteOperations });

      if (deleteResponse.errors) {
        console.error('Errors occurred during bulk deletion:', deleteResponse.errors);
      } else {
        console.log(`Deleted ${hits.length} documents from the 'movies' index`);
        deleted += hits.length;
      }
    } catch (err) {
      console.error('Error during deletion:', err);
      break;
    }
  }

  console.log(`Total documents deleted: ${deleted}`);
}

// Execute the bulk indexing, updating, and deletion
(async () => {
  // Uncomment the next line if you need to delete all movies before reindexing
  await deleteAllMoviesInBatches();

  await bulkIndexInBatches(operations);
})();
