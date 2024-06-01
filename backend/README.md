# Backend implementation 




## Tech Stack

**Backend stack :** 

[Node.js](https://nodejs.org/en/download/) (version 14 or above)

[Yarn](https://yarnpkg.com/getting-started/install) (recommended) or npm

Running instance of Neo4j database
## Installation


Install yarn with npm

```bash
  npm i -g yarn
```
Create .env file with database credintials and port details

## Setting Up DB remotely
Neo4j database hosted on Neo4jAura 

Download Neo4j Desktop at https://neo4j.com/download 

Add  new remote connection in your project using Connect Url: 
`neo4j+s://d16778b5.databases.neo4j.io`

[Connecting to an instance](https://neo4j.com/docs/aura/auradb/getting-started/connect-database/)



## Initialise Local Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT = 3000 //temp`

`NEO4J_URI=neo4j+s://<YOUR_NEO4J_INSTANCE_URI>`

`NEO4J_USERNAME=<YOUR_NEO4J_USERNAME>`

`pNEO4J_PASSWORD=<YOUR_NEO4J_PASSWORD>`

`database = neo4j`
## Run Locally

Clone the project

```bash
  git clone https://github.com/COS301-SE-2024/MovieHub 
```

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn start
```


## Running Tests

To run tests, run the following command

```bash
  yarn test
```

