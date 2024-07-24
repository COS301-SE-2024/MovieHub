// backend/src/scripts/setupElasticsearch.js
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({ node: 'http://localhost:9200' });

const setupIndex = async () => {
    await client.indices.create({
        index: 'movies',
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
};

setupIndex().catch(console.error);
