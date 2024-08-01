// backend/src/scripts/setupElasticsearch.js
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({ node: 'http://localhost:9200' });

const setupIndex = async () => {
    const indexName = 'test-movies';

    // Check if the index already exists
    const { body: exists } = await client.indices.exists({ index: indexName });

    if (!exists) {
        console.log(`Creating index '${indexName}'...`);
        await client.indices.create({
            index: indexName,
            body: {
                mappings: {
                    properties: {
                        title: { type: 'text' },
                        overview: { type: 'text' },
                        genres: { type: 'text' },
                        genre_ids: { type: 'integer' },
                    }
                }
            }
        });
        console.log(`Index '${indexName}' created.`);
    } else {
        console.log(`Index '${indexName}' already exists. Skipping creation.`);
    }
};

module.exports = setupIndex;
