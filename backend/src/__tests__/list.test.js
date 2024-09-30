const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const listRouter = require('../Watchlist/list.router');
const listService = require('../Watchlist/list.services');

dotenv.config();

// Create an instance of the app with the listRouter
const app = express();
app.use(express.json());
app.use('/list', listRouter);

jest.mock('../Watchlist/list.services');

describe('POST /list/:userid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a watchlist successfully', async () => {
        const userId = 'testUser';
        const watchlistData = { name: 'Test Watchlist', description: 'Test Description' };
        const createdWatchlist = { ...watchlistData, id: 'testWatchlistId' };

        listService.createWatchlist.mockResolvedValueOnce(createdWatchlist);

        const res = await request(app)
            .post(`/list/${userId}`)
            .send(watchlistData);

        expect(res.status).toBe(201);
        expect(res.body).toEqual(createdWatchlist);
    });

    it('should return 500 if watchlist creation fails', async () => {
        const userId = 'testUser';
        const watchlistData = { name: 'Test Watchlist', description: 'Test Description' };
        const errorMessage = 'Error creating watchlist';

        listService.createWatchlist.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post(`/list/${userId}`)
            .send(watchlistData);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: errorMessage });
    });
});

describe('PATCH /list/:watchlistId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should modify a watchlist successfully', async () => {
        const watchlistId = 'testWatchlistId';
        const updatedData = { name: 'Updated Watchlist', description: 'Updated Description' };
        const modifiedWatchlist = { ...updatedData, id: watchlistId };

        listService.modifyWatchlist.mockResolvedValueOnce(modifiedWatchlist);

        const res = await request(app)
            .patch(`/list/${watchlistId}`)
            .send(updatedData);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(modifiedWatchlist);
    });

    it('should return 500 if watchlist modification fails', async () => {
        const watchlistId = 'testWatchlistId';
        const updatedData = { name: 'Updated Watchlist', description: 'Updated Description' };
        const errorMessage = 'Error modifying watchlist';

        listService.modifyWatchlist.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .patch(`/list/${watchlistId}`)
            .send(updatedData);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: errorMessage });
    });
});

describe('GET /list/:watchlistId/collaborators', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch collaborators successfully', async () => {
        const watchlistId = 'testWatchlistId';
        const collaborators = [{ userId: 'user1' }, { userId: 'user2' }];

        listService.getCollaborators.mockResolvedValueOnce(collaborators);

        const res = await request(app)
            .get(`/list/${watchlistId}/collaborators`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ collaborators });
    });

    it('should return 500 if fetching collaborators fails', async () => {
        const watchlistId = 'testWatchlistId';
        const errorMessage = 'Error fetching collaborators';

        listService.getCollaborators.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .get(`/list/${watchlistId}/collaborators`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Error fetching collaborators', error: errorMessage });
    });
});

describe('DELETE /list/:watchlistId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a watchlist successfully', async () => {
        const watchlistId = 'testWatchlistId';

        listService.deleteWatchlist.mockResolvedValueOnce(true);

        const res = await request(app)
            .delete(`/list/${watchlistId}`);

        expect(res.status).toBe(204);  // No content status for successful deletion
    });

    it('should return 500 if deleting watchlist fails', async () => {
        const watchlistId = 'testWatchlistId';
        const errorMessage = 'Error deleting watchlist';

        listService.deleteWatchlist.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .delete(`/list/${watchlistId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: errorMessage });
    });
});

describe('GET /list/:userId/followed-watchlists', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get followed users watchlists successfully', async () => {
        const userId = 'testUser';
        const watchlists = [{ id: 'watchlist1', name: 'Watchlist 1' }];

        listService.getFollowedUsersWatchlists.mockResolvedValueOnce(watchlists);

        const res = await request(app)
            .get(`/list/${userId}/followed-watchlists`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(watchlists);
    });

    it('should return 500 if fetching followed users watchlists fails', async () => {
        const userId = 'testUser';
        const errorMessage = 'Error fetching followed users watchlists';

        listService.getFollowedUsersWatchlists.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .get(`/list/${userId}/followed-watchlists`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error' });
    });
});
