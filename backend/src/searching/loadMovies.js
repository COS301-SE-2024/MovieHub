const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

// Create the Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' });

// Read the bulk data from the file
const data = fs.readFileSync('bulk_output.json', 'utf-8');
const bulkData = data.split('\n').filter(line => line.trim() !== '');

// Function to process bulk operations in batches of 1000
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

// Check if a document with the same ID exists and update if necessary
async function updateIfExists() {
  for (let i = 0; i < bulkData.length; i += 2) {
    const indexAction = JSON.parse(bulkData[i]);
    const document = JSON.parse(bulkData[i + 1]);

    try {
      const { body: existingDoc } = await client.get({
        index: 'movies',
        id: indexAction.index._id
      });

      // If the document exists, update the movieId and overview fields
      if (existingDoc) {
        const updatedDoc = {
          ...existingDoc._source,
          movieId: document.movieId,
          overview: document.overview // Include the overview field if present
        };

        await client.update({
          index: 'movies',
          id: indexAction.index._id,
          body: {
            doc: updatedDoc
          }
        });
        console.log(`Updated document ID ${indexAction.index._id}`);
      }
    } catch (err) {
      if (err.meta.statusCode === 404) {
        // Document does not exist, proceed with bulk indexing
      } else {
        console.error(`Error checking document ${indexAction.index._id}:`, err);
      }
    }
  }
}

// Execute the bulk indexing and updating
(async () => {
 //await updateIfExists();
  await bulkIndexInBatches(operations);
})();
