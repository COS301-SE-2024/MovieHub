# Backend implementation 




## Tech Stack

**Backend stack :** 

NodeJS

Express 

yarn 

babel


## Installation


Install yarn with npm

```bash
  npm i -g yarn
```
Initiaise yarn project 
```bash
  yarn init -y 
```

Install babel dependencies
```bash
  yarn add -D @babel/core @babel/node @babel/preset-env 
```

Install Neo4j driver
```bash
  yarn add express dotenv neo4j-driver
```

Create .env file with database credintials and port details

### Setting up DB
Download Neo4j at https://neo4j.com/download 


## Initialise Local Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT = 3000 //temp`

`url = bolt://localhost:7689`

`username = neo4j`

`password = passNeo4j`

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
  yarn run start
```

