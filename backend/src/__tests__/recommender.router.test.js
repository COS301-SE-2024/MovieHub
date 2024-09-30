// backend/src/recommender/recommender.router.test.js
const request = require('supertest');
const express = require('express');
const recommenderRouter = require('../Recommender/recommender.router');
const { recommendMoviesByTMDBId } = require('../Recommender/recommender.service');

jest.mock('../Recommender/recommender.service');

const app = express();
app.use(express.json());
app.use('/recommender', recommenderRouter);

describe('GET /recommender/:tmdbId/:userId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return recommendations for a valid request', async () => {
        const tmdbId = '123';
        const userId = '456';
        const mockRecommendations = [{ title: 'Movie A' }, { title: 'Movie B' }];

        recommendMoviesByTMDBId.mockResolvedValueOnce(mockRecommendations);

        const res = await request(app)
            .get(`/recommender/${tmdbId}/${userId}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRecommendations);
    });

    it('should return 500 for an internal server error', async () => {
        const tmdbId = '123';
        const userId = '456';
        const mockErrorMessage = 'Internal server error';

        recommendMoviesByTMDBId.mockRejectedValueOnce(new Error(mockErrorMessage));

        const res = await request(app)
            .get(`/recommender/${tmdbId}/${userId}`)
            .send();

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: mockErrorMessage });
    });
});
