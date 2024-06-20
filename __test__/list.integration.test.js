// ListApiServices.test.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ListApiServices from 'frontend/src/Services/ListApiServices';

const mock = new MockAdapter(axios);
const API_BASE_URL = process.env.REACT_APP_LIST_API_URL || 'http://localhost:5000';

describe('ListApiServices', () => {
    afterEach(() => {
        mock.reset();
    });

    describe('createWatchlist', () => {
        it('should create a new watchlist', async () => {
            const userId = 'user2';
            const watchlistData = {
                name: 'My Watchlist',
                tags: ['tag1', 'tag2'],
                visibility: 'public',
                ranked: true,
                description: 'My favorite movies',
                collaborative: false,
                movies: ['Inception', 'Interstellar']
            };

            mock.onPost(`${API_BASE_URL}/list/${userId}`).reply(201, {
                id: 'test-watchlist-id',
                ...watchlistData
            });

            const response = await ListApiServices.createWatchlist(userId, watchlistData);
            expect(response).toHaveProperty('id', 'test-watchlist-id');
            expect(response).toHaveProperty('name', watchlistData.name);
            expect(response).toHaveProperty('movies', watchlistData.movies);
        });

        it('should handle create watchlist error', async () => {
            const userId = 'user2';
            const watchlistData = {
                name: 'My Watchlist',
                tags: ['tag1', 'tag2'],
                visibility: 'public',
                ranked: true,
                description: 'My favorite movies',
                collaborative: false,
                movies: ['Inception', 'Interstellar']
            };

            mock.onPost(`${API_BASE_URL}/list/${userId}`).reply(500);

            await expect(ListApiServices.createWatchlist(userId, watchlistData)).rejects.toThrow('Failed to create watchlist.');
        });
    });

    describe('modifyWatchlist', () => {
        it('should modify an existing watchlist', async () => {
            const watchlistId = 'test-watchlist-id';
            const updatedData = {
                name: 'Updated Watchlist',
                tags: ['updated-tag1', 'updated-tag2'],
                visibility: 'private',
                ranked: false,
                description: 'Updated description',
                collaborative: true,
                movies: ['Matrix', 'Avatar']
            };

            mock.onPatch(`${API_BASE_URL}/list/${watchlistId}`).reply(200, {
                id: watchlistId,
                ...updatedData
            });

            const response = await ListApiServices.modifyWatchlist(watchlistId, updatedData);
            expect(response).toHaveProperty('id', watchlistId);
            expect(response).toHaveProperty('name', updatedData.name);
            expect(response).toHaveProperty('movies', updatedData.movies);
        });

        it('should handle modify watchlist error', async () => {
            const watchlistId = 'test-watchlist-id';
            const updatedData = {
                name: 'Updated Watchlist',
                tags: ['updated-tag1', 'updated-tag2'],
                visibility: 'private',
                ranked: false,
                description: 'Updated description',
                collaborative: true,
                movies: ['Matrix', 'Avatar']
            };

            mock.onPatch(`${API_BASE_URL}/list/${watchlistId}`).reply(500);

            await expect(ListApiServices.modifyWatchlist(watchlistId, updatedData)).rejects.toThrow('Failed to modify watchlist.');
        });
    });

    describe('deleteWatchlist', () => {
        it('should delete an existing watchlist', async () => {
            const watchlistId = 'test-watchlist-id';

            mock.onDelete(`${API_BASE_URL}/list/${watchlistId}`).reply(204);

            await expect(ListApiServices.deleteWatchlist(watchlistId)).resolves.not.toThrow();
        });

        it('should handle delete watchlist error', async () => {
            const watchlistId = 'test-watchlist-id';

            mock.onDelete(`${API_BASE_URL}/list/${watchlistId}`).reply(500);

            await expect(ListApiServices.deleteWatchlist(watchlistId)).rejects.toThrow('Failed to delete watchlist.');
        });
    });
});
