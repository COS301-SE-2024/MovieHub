// backend/src/recommender/recommender.controller.test.js
const { getRecommendations } = require('../Recommender/recommender.controller');
const { recommendMoviesByTMDBId } = require('../Recommender/recommender.service');

jest.mock('../Recommender/recommender.service');

describe('Recommender Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { tmdbId: '123', userId: '456' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return recommendations successfully', async () => {
        const mockRecommendations = [{ title: 'Movie A' }, { title: 'Movie B' }];
        recommendMoviesByTMDBId.mockResolvedValueOnce(mockRecommendations);

        await getRecommendations(req, res);

        expect(recommendMoviesByTMDBId).toHaveBeenCalledWith('123', '456');
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockRecommendations);
    });

    it('should handle service errors gracefully', async () => {
        const mockError = new Error('Service error');
        recommendMoviesByTMDBId.mockRejectedValueOnce(mockError);

        await getRecommendations(req, res);

        expect(recommendMoviesByTMDBId).toHaveBeenCalledWith('123', '456');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});
