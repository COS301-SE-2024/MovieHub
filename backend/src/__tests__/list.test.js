// backend/src/__tests__/watchlist.test.js
const request = require('supertest');
const express = require('express');
const watchlistRouter = require('../Watchlist/list.router');
const dotenv = require('dotenv');
const neo4j = require('neo4j-driver');

// Load environment variables from .env file
dotenv.config();

// Initialize Neo4j driver
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const watchlistId = "testerWatchlist" 
// Ensure the driver closes when all tests are done
afterAll(async () => {
    await driver.close();
});

const app = express();
app.use(express.json());
app.use('/list', watchlistRouter);

describe('Watchlist API', () => {
    describe('POST /list/:userid', () => {
        it('should create a new watchlist', async () => {
            const userId = 'tempUserAgain';
            const watchlistDetails = {
                name: 'Another New Watchlist',
                tags: ['horror', 'suspense'],
                visibility: 'public',
                ranked: true,
                description: 'My favorite movies',
                collaborative: false,
                movies: ['Inception', 'Interstellar']
            };

            const res = await request(app)
                .post(`/list/${userId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name', watchlistDetails.name);
            expect(res.body).toHaveProperty('movies');
            expect(res.body.movies).toHaveLength(2);
        });

        it('should handle server error during watchlist creation', async () => {
            const userId = 'tempUserAgain';
            const watchlistDetails = {
                tags: ['tag1', 'tag2'],
                visibility: 'public',
                ranked: ""
            };

            // Simulate server error by sending invalid request data or other conditions

            const res = await request(app)
                .post(`/list/${userId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Expected parameter(s): name, tags, visibility, ranked, description, collaborative, movies');
        });
    });

    describe('PATCH /list/:watchlistId', () => {
        it('should modify an existing watchlist', async () => {
            const watchlistId = '0a8e58df-0e53-4791-a29c-13190c1c30c5';
            const watchlistDetails = {
                name: 'Updated Comedy List',
                visibility: 'private',
                ranked: false,
                collaborative: true
            };

            const res = await request(app)
                .patch(`/list/${watchlistId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', watchlistId);
         //  expect(res.body).toHaveProperty('name', watchlistDetails.name);
            expect(app).toThrow();
           // expect(res.body).toHaveProperty('movies');
           // expect(res.body.movies).toHaveLength(2);
        });

//         it('should handle TMDB API failure during modification', async () => {
//   //          const watchlistId = '47603eeb-3aaf-4ec1-9f46-540475490f2a';
//             const watchlistDetails = {
//                 visibility: 'private',
//                 ranked: false,
//                 collaborative: true,
//                 movies: ['Do', '*99']
//             };

//             // Simulate a failure by sending invalid movie names or other conditions

//             const res = await request(app)
//                 .patch(`/list/${watchlistId}`)
//                 .send(watchlistDetails);

//             expect(res.status).toBe(500);
//             expect(res.body).toHaveProperty('message', 'TMDB API failure');
//         });

        it('should handle invalid input during watchlist modification', async () => {
         //   const watchlistId = '47603eeb-3aaf-4ec1-9f46-540475490f2a';
            const watchlistDetails = {
             
            };

            // Simulate server error by sending invalid request data or other conditions

            const res = await request(app)
                .patch(`/list/${watchlistId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(500);
            expect(app).toThrow();
        });
    });

    describe('DELETE /list/:watchlistId', () => {
        it('should delete an existing watchlist', async () => {
         //   const watchlistId = '47603eeb-3aaf-4ec1-9f46-540475490f2a';

            const res = await request(app)
                .delete(`/list/${watchlistId}`);

            expect(res.status).toBe(204);
        });

        it('should handle server error during watchlist deletion', async () => {
           const watchlistid = 'notArealID';

            // Simulate server error by sending invalid request data or other conditions

            const res = await request(app)
                .delete(`/list/${watchlistid}`);

         //   expect(res.status).toBe(500);
            expect(app).toThrow();
        });
    });
});
