const commentService = require('../Comment/comment.services');
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

describe('Comment Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('addComment should add a comment to a movie', async () => {
        const userId = 'user1';
        const movieId = 'movie1';
        const text = 'Great movie!';
        const comment = { id: 'comment1', text };

        mockRun.mockResolvedValue({ records: [{ get: () => ({ properties: comment }) }] });

        const result = await commentService.addComment(userId, movieId, text);

        expect(result).toEqual(comment);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, movieId, text }
        );
    });

    test('addComment should add a comment to a comment', async () => {
        const userId = 'user1';
        const parentCommentId = 'comment1';
        const text = 'I agree!';
        const comment = { id: 'comment2', text };

        mockRun.mockResolvedValue({ records: [{ get: () => ({ properties: comment }) }] });

        const result = await commentService.addComment(userId, null, text, parentCommentId);

        expect(result).toEqual(comment);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, parentCommentId, text }
        );
    });

    test('editComment should edit a comment', async () => {
        const commentId = 'comment1';
        const newText = 'Updated comment';
        const comment = { id: commentId, text: newText };

        mockRun.mockResolvedValue({ records: [{ get: () => ({ properties: comment }) }] });

        const result = await commentService.editComment(commentId, newText);

        expect(result).toEqual(comment);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { commentId, newText }
        );
    });

    test('removeComment should remove a comment', async () => {
        const commentId = 'comment1';

        mockRun.mockResolvedValue({});

        const result = await commentService.removeComment(commentId);

        expect(result).toEqual(true);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { commentId }
        );
    });

    test('toggleLikeComment should like a comment', async () => {
        const userId = 'user1';
        const commentId = 'comment1';

        mockRun.mockResolvedValue({ records: [{ get: () => true }] });

        const result = await commentService.toggleLikeComment(userId, commentId);

        expect(result).toEqual(true);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, commentId }
        );
    });

    test('toggleLikeComment should remove like from a comment', async () => {
        const userId = 'user1';
        const commentId = 'comment1';

        mockRun.mockResolvedValue({ records: [{ get: () => false }] });

        const result = await commentService.toggleLikeComment(userId, commentId);

        expect(result).toEqual(false);
        expect(mockRun).toHaveBeenCalledWith(
            expect.any(String),
            { userId, commentId }
        );
    });
});
