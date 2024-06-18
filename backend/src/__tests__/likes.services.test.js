const neo4j = require('neo4j-driver');
const { toggleLikeReview, toggleLikeComment, toggleLikeMovie } = require('./likes.services'); // Adjust the path as necessary

jest.mock('neo4j-driver');

describe('Likes Services', () => {
    let sessionMock;

    beforeEach(() => {
        sessionMock = {
            run: jest.fn(),
            close: jest.fn(),
        };
        neo4j.driver.mockReturnValue({
            session: jest.fn(() => sessionMock),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('toggleLikeReview', () => {
        it('likes a review if not already liked', async () => {
            sessionMock.run.mockResolvedValueOnce({ records: [] });
            sessionMock.run.mockResolvedValueOnce();

            const result = await toggleLikeReview('userId', 'reviewId');

            expect(sessionMock.run).toHaveBeenCalledTimes(2);
            expect(sessionMock.run).toHaveBeenNthCalledWith(1, expect.any(String), { userId: 'userId', entityId: 'reviewId' });
            expect(sessionMock.run).toHaveBeenNthCalledWith(2, expect.any(String), { userId: 'userId', entityId: 'reviewId' });
            expect(result).toBe(true);
        });

        it('removes like from a review if already liked', async () => {
            sessionMock.run.mockResolvedValueOnce({ records: [{ get: jest.fn() }] });
            sessionMock.run.mockResolvedValueOnce();

            const result = await toggleLikeReview('userId', 'reviewId');

            expect(sessionMock.run).toHaveBeenCalledTimes(2);
            expect(sessionMock.run).toHaveBeenNthCalledWith(1, expect.any(String), { userId: 'userId', entityId: 'reviewId' });
            expect(sessionMock.run).toHaveBeenNthCalledWith(2, expect.any(String), { userId: 'userId', entityId: 'reviewId' });
            expect(result).toBe(false);
        });
    });

    describe('toggleLikeComment', () => {
        it('likes a comment if not already liked', async () => {
            sessionMock.run.mockResolvedValueOnce({ records: [] });
            sessionMock.run.mockResolvedValueOnce();

            const result = await toggleLikeComment('userId', 'commentId');

            expect(sessionMock.run).toHaveBeenCalledTimes(2);
            expect(sessionMock.run).toHaveBeenNthCalledWith(1, expect.any(String), { userId: 'userId', entityId: 'commentId' });
            expect(sessionMock.run).toHaveBeenNthCalledWith(2, expect.any(String), { userId: 'userId', entityId: 'commentId' });
            expect(result).toBe(true);
        });

        it('removes like from a comment if already liked', async () => {
            sessionMock.run.mockResolvedValueOnce({ records: [{ get: jest.fn() }] });
            sessionMock.run.mockResolvedValueOnce();

            const result = await toggleLikeComment('userId', 'commentId');

            expect(sessionMock.run).toHaveBeenCalledTimes(2);
            expect(sessionMock.run).toHaveBeenNthCalledWith(1, expect.any(String), { userId: 'userId', entityId: 'commentId' });
            expect(sessionMock.run).toHaveBeenNthCalledWith(2, expect.any(String), { userId: 'userId', entityId: 'commentId' });
            expect(result).toBe(false);
        });
    });

    describe('toggleLikeMovie', () => {
        it('likes a movie if not already liked', async () => {
            sessionMock.run.mockResolvedValueOnce({ records: [] });
            sessionMock.run.mockResolvedValueOnce();

            const result = await toggleLikeMovie('userId', 'movieId');

            expect(sessionMock.run).toHaveBeenCalledTimes(2);
            expect(sessionMock.run).toHaveBeenNthCalledWith(1, expect.any(String), { userId: 'userId', entityId: 'movieId' });
            expect(sessionMock.run).toHaveBeenNthCalledWith(2, expect.any(String), { userId: 'userId', entityId: 'movieId' });
            expect(result).toBe(true);
        });

        it('removes like from a movie if already liked', async () => {
            sessionMock.run.mockResolvedValueOnce({ records: [{ get: jest.fn() }] });
            sessionMock.run.mockResolvedValueOnce();

            const result = await toggleLikeMovie('userId', 'movieId');

            expect(sessionMock.run).toHaveBeenCalledTimes(2);
            expect(sessionMock.run).toHaveBeenNthCalledWith(1, expect.any(String), { userId: 'userId', entityId: 'movieId' });
            expect(sessionMock.run).toHaveBeenNthCalledWith(2, expect.any(String), { userId: 'userId', entityId: 'movieId' });
            expect(result).toBe(false);
        });
    });
});
