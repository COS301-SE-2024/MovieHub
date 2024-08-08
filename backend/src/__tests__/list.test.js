const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const watchlistRouter = require('../Watchlist/list.router');
const watchlistService = require('../Watchlist/list.services');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/list', watchlistRouter);

jest.mock('../Watchlist/list.services');

describe('Watchlist API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /list/:userid', () => {
        it('should create a watchlist for a valid user ID', async () => {
            const userId = 'testUser';
            const watchlistData = {
                name: 'My Watchlist',
                tags: ['action', 'drama'],
                visibility: 'public',
                ranked: true,
                description: 'My favorite movies',
                collaborative: false,
                movies: ['Inception', 'The Matrix']
            };
            const createdWatchlist = { id: '1', ...watchlistData };

            watchlistService.createWatchlist.mockResolvedValueOnce(createdWatchlist);

            const res = await request(app)
                .post(`/list/${userId}`)
                .send(watchlistData);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                message: 'Watchlist created successfully',
                data: createdWatchlist
            });
        });

        it('should return 400 for missing required parameters', async () => {
            const userId = 'testUser';
            const incompleteData = { name: 'My Watchlist' };
        
            watchlistService.createWatchlist.mockImplementationOnce(() => {
                const error = new Error('Expected parameter(s): tags, visibility, ranked, description, collaborative, movies');
                error.statusCode = 400;
                throw error;
            });
        
            const res = await request(app)
                .post(`/list/${userId}`)
                .send(incompleteData);
        
            console.log("result:", res.body);
        
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Expected parameter(s): tags, visibility, ranked, description, collaborative, movies' });
        });
        

        it('should return 500 for an internal server error', async () => {
            const userId = 'testUser';
            const watchlistData = {
                name: 'My Watchlist',
                tags: ['action', 'drama'],
                visibility: 'public',
                ranked: true,
                description: 'My favorite movies',
                collaborative: false,
                movies: ['Inception', 'The Matrix']
            };
            const errorMessage = 'Internal server error';
        
            watchlistService.createWatchlist.mockRejectedValueOnce(new Error(errorMessage));
        
            const res = await request(app)
                .post(`/list/${userId}`)
                .send(watchlistData);
        
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: errorMessage });
        });
    });

    describe('PATCH /list/:watchlistId', () => {
        it('should update a watchlist for a valid watchlist ID', async () => {
            const watchlistId = '1';
            const updatedData = { name: 'Updated Watchlist' };
            const updatedWatchlist = { id: watchlistId, ...updatedData };

            watchlistService.modifyWatchlist.mockResolvedValueOnce(updatedWatchlist);

            const res = await request(app)
                .patch(`/list/${watchlistId}`)
                .send(updatedData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: 'Watchlist updated successfully',
                data: updatedWatchlist
            });
        });

        it('should return 400 for an invalid watchlist ID', async () => {
            const watchlistId = 'invalidId';
            const updatedData = { name: 'Updated Watchlist' };

            watchlistService.modifyWatchlist.mockResolvedValueOnce(null);

            const res = await request(app)
                .patch(`/list/${watchlistId}`)
                .send(updatedData);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Error updating watchlist' });
        });

        it('should return 500 for an internal server error', async () => {
            const watchlistId = '1';
            const updatedData = { name: 'Updated Watchlist' };
            const errorMessage = 'Internal server error';

            watchlistService.modifyWatchlist.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .patch(`/list/${watchlistId}`)
                .send(updatedData);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
        });
    });

    describe('GET /list/:watchlistId', () => {
        it('should return watchlist details for a valid watchlist ID', async () => {
            const watchlistId = '1';
            const watchlistDetails = {
                name: 'My Watchlist',
                movieList: [
                    { id: '123', title: 'Inception', genre: 'Action', duration: 148, poster_path: '/path/to/poster' },
                    { id: '456', title: 'The Matrix', genre: 'Sci-Fi', duration: 136, poster_path: '/path/to/poster' }
                ]
            };

            watchlistService.getWatchlistDetails.mockResolvedValueOnce(watchlistDetails);

            const res = await request(app).get(`/list/${watchlistId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: 'Watchlist details fetched successfully',
                data: watchlistDetails
            });
        });

        it('should return 400 for an invalid watchlist ID', async () => {
            const watchlistId = 'invalidId';

            watchlistService.getWatchlistDetails.mockResolvedValueOnce(null);

            const res = await request(app).get(`/list/${watchlistId}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Error fetching watchlist details' });
        });

        it('should return 500 for an internal server error', async () => {
            const watchlistId = '1';
            const errorMessage = 'Internal server error';

            watchlistService.getWatchlistDetails.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app).get(`/list/${watchlistId}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
        });
    });

    describe('DELETE /list/:watchlistId', () => {
        it('should delete a watchlist for a valid watchlist ID', async () => {
            const watchlistId = '1';

            watchlistService.deleteWatchlist.mockResolvedValueOnce(true);

            const res = await request(app).delete(`/list/${watchlistId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: 'Watchlist deleted successfully',
                data: null
            });
        });

        it('should return 400 for an invalid watchlist ID', async () => {
            const watchlistId = 'invalidId';

            watchlistService.deleteWatchlist.mockResolvedValueOnce(false);

            const res = await request(app).delete(`/list/${watchlistId}`);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Error deleting watchlist' });
        });

        it('should return 500 for an internal server error', async () => {
            const watchlistId = '1';
            const errorMessage = 'Internal server error';

            watchlistService.deleteWatchlist.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app).delete(`/list/${watchlistId}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
        });
    });
});
