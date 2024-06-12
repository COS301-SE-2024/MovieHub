const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    'neo4j+s://d16778b5.databases.neo4j.io',
    neo4j.auth.basic('neo4j', '1yDboUOlGobuDEJX6xw_JitPl-93pTFKN6iYJCyyvt0')
);

module.exports = driver;
