import likesService from '../Likes/likes.services';
import responseHandler from '../utils/responseHandler';
import likesController from '../Likes/likes.controller';

jest.mock('../Likes/likes.services');
jest.mock('../utils/responseHandler');

describe('Likes Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('toggleLikeReview should like/unlike a review', async () => {
        req.body = { userId: 'user1', reviewId: 'review1' };
        likesService.toggleLikeReview.mockResolvedValue(true);

        await likesController.toggleLikeReview(req, res);

        expect(likesService.toggleLikeReview).toHaveBeenCalledWith(req.body.userId, req.body.reviewId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Review liked successfully');
    });

    test('toggleLikeComment should like/unlike a comment', async () => {
        req.body = { userId: 'user1', commentId: 'comment1' };
        likesService.toggleLikeComment.mockResolvedValue(true);

        await likesController.toggleLikeComment(req, res);

        expect(likesService.toggleLikeComment).toHaveBeenCalledWith(req.body.userId, req.body.commentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment liked successfully');
    });

    test('toggleLikeMovie should like/unlike a movie', async () => {
        req.body = { userId: 'user1', movieId: 'movie1' };
        likesService.toggleLikeMovie.mockResolvedValue(true);

        await likesController.toggleLikeMovie(req, res);

        expect(likesService.toggleLikeMovie).toHaveBeenCalledWith(req.body.userId, req.body.movieId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Movie liked successfully');
    });

    test('toggleLikeReview should handle error', async () => {
        req.body = { userId: 'user1', reviewId: 'review1' };
        const errorMessage = 'Error liking review';
        likesService.toggleLikeReview.mockRejectedValue(new Error(errorMessage));

        await likesController.toggleLikeReview(req, res);

        expect(likesService.toggleLikeReview).toHaveBeenCalledWith(req.body.userId, req.body.reviewId);
        expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
    });

    test('toggleLikeComment should handle error', async () => {
        req.body = { userId: 'user1', commentId: 'comment1' };
        const errorMessage = 'Error liking comment';
        likesService.toggleLikeComment.mockRejectedValue(new Error(errorMessage));

        await likesController.toggleLikeComment(req, res);

        expect(likesService.toggleLikeComment).toHaveBeenCalledWith(req.body.userId, req.body.commentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
    });

    test('toggleLikeMovie should handle error', async () => {
        req.body = { userId: 'user1', movieId: 'movie1' };
        const errorMessage = 'Error liking movie';
        likesService.toggleLikeMovie.mockRejectedValue(new Error(errorMessage));

        await likesController.toggleLikeMovie(req, res);

        expect(likesService.toggleLikeMovie).toHaveBeenCalledWith(req.body.userId, req.body.movieId);
        expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
    });
});
