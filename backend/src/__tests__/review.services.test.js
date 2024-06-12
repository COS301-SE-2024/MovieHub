const reviewService = require('../Review/review.services');
const { mockSession, mockRun } = require('../__mocks__/neo4j');

jest.mock('neo4j-driver', () => {
    const neo4j = jest.requireActual('neo4j-driver');
    return {
        ...neo4j,
        driver: jest.fn(() => ({
            session: jest.fn(() => mockSession)
        }))
    };
});

describe('Review Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user1';
    const movieId = 'movie1';
    const text = 'Great movie!';
    const reviewId = 'review1';
    const commentId = 'comment1';
    const newText = 'Updated text';

    test('addReview should add a review', async () => {
        mockRun.mockResolvedValue({ records: [{ get: () => ({ properties: { id: reviewId, text } }) }] });

        const result = await reviewService.addReview(userId, movieId, text);

        expect(result).toEqual({ id: reviewId, text });
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, movieId, text }
        );
    });

    test('addCommentToReview should add a comment to a review', async () => {
        mockRun.mockResolvedValue({ records: [{ get: () => ({ properties: { id: commentId, text, movieId } }) }] });

        const result = await reviewService.addCommentToReview(userId, reviewId, movieId, text);

        expect(result).toEqual({ id: commentId, text, movieId });
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, reviewId, movieId, text }
        );
    });

    test('addCommentToComment should add a comment to a comment', async () => {
        mockRun.mockResolvedValue({ records: [{ get: () => ({ properties: { id: commentId, text, movieId } }) }] });

        const result = await reviewService.addCommentToComment(userId, commentId, movieId, text);

        expect(result).toEqual({ id: commentId, text, movieId });
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, commentId, movieId, text }
        );
    });

    test('editReview should edit a review', async () => {
        mockRun.mockResolvedValue({ records: [{ get: () => ({ properties: { id: reviewId, text: newText } }) }] });

        const result = await reviewService.editReview(reviewId, newText);

        expect(result).toEqual({ id: reviewId, text: newText });
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { reviewId, newText }
        );
    });

    test('editComment should edit a comment', async () => {
        mockRun.mockResolvedValue({ records: [{ get: () => ({ properties: { id: commentId, text: newText } }) }] });

        const result = await reviewService.editComment(commentId, newText);

        expect(result).toEqual({ id: commentId, text: newText });
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { commentId, newText }
        );
    });

    test('removeReview should remove a review', async () => {
        mockRun.mockResolvedValue();

        const result = await reviewService.removeReview(reviewId);

        expect(result).toEqual(true);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { reviewId }
        );
    });

    test('removeComment should remove a comment', async () => {
        mockRun.mockResolvedValue();

        const result = await reviewService.removeComment(commentId);

        expect(result).toEqual(true);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { commentId }
        );
    });

    test('toggleLikeReview should like a review', async () => {
        mockRun.mockResolvedValue({ records: [{ get: () => true }] });

        const result = await reviewService.toggleLikeReview(userId, reviewId);

        expect(result).toEqual(true);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, reviewId }
        );
    });

    test('toggleLikeReview should remove like from a review', async () => {
        mockRun.mockResolvedValue({ records: [{ get: () => false }] });

        const result = await reviewService.toggleLikeReview(userId, reviewId);

        expect(result).toEqual(false);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, reviewId }
        );
    });
});
