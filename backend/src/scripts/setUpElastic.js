const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({ node: 'http://localhost:9200' });

const setupIndex = async () => {
    const indexName = 'movies';

    // Check if the index already exists
    const indexExists = await client.indices.exists({ index: indexName });

    if (!indexExists.body) { // Modify based on Elasticsearch client version
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
        console.log(`Index '${indexName}' created successfully.`);
    } else {
        console.log(`Index '${indexName}' already exists.`);
    }
};

setupIndex().catch(console.error);
