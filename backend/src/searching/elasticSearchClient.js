const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://localhost:9200', // Replace with your instance URL
  auth: {
    username: 'your-username',   // Only if authentication is needed
    password: 'your-password',   // Only if authentication is needed
  },
});

// Example function to check the connection
async function checkConnection() {
  try {
    const response = await client.ping();
    console.log('Elasticsearch is up:', response);
  } catch (error) {
    console.error('Elasticsearch connection error:', error);
  }
}

checkConnection();
