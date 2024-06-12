const reviewService = require('../Review/review.services');
const responseHandler = require('../utils/responseHandler');
const reviewController = require('../Review/review.controller');

jest.mock('../Review/review.controller');
jest.mock('../utils/responseHandler');

describe('Review Controller', () => {
    const req = { body: { userId: 'user1', movieId: 'movie1', text: 'Great movie!', reviewId: 'review1', commentId: 'comment1', newText: 'Updated text' } };
    const res = {};

    beforeEach(() => {
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        jest.clearAllMocks();
    });

    test('addReview should add a review', async () => {
        const review = { id: 'review1', text: 'Great movie!' };
        reviewService.addReview.mockResolvedValue(review);

        await reviewController.addReview(req, res);

        expect(reviewService.addReview).toHaveBeenCalledWith(req.body.userId, req.body.movieId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Review added successfully', review);
    });

    test('addCommentToReview should add a comment to a review', async () => {
        const comment = { id: 'comment1', text: 'I agree!', movieId: 'movie1' };
        reviewService.addCommentToReview.mockResolvedValue(comment);

        await reviewController.addCommentToReview(req, res);

        expect(reviewService.addCommentToReview).toHaveBeenCalledWith(req.body.userId, req.body.reviewId, req.body.movieId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Comment added to review successfully', comment);
    });

    test('addCommentToComment should add a comment to a comment', async () => {
        const comment = { id: 'comment2', text: 'I agree with this comment!', movieId: 'movie1' };
        reviewService.addCommentToComment.mockResolvedValue(comment);

        await reviewController.addCommentToComment(req, res);

        expect(reviewService.addCommentToComment).toHaveBeenCalledWith(req.body.userId, req.body.commentId, req.body.movieId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Comment added to comment successfully', comment);
    });

    test('editReview should edit a review', async () => {
        const review = { id: 'review1', text: 'Updated text' };
        reviewService.editReview.mockResolvedValue(review);

        await reviewController.editReview(req, res);

        expect(reviewService.editReview).toHaveBeenCalledWith(req.body.reviewId, req.body.newText);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Review edited successfully', review);
    });

    test('editComment should edit a comment', async () => {
        const comment = { id: 'comment1', text: 'Updated text' };
        reviewService.editComment.mockResolvedValue(comment);

        await reviewController.editComment(req, res);

        expect(reviewService.editComment).toHaveBeenCalledWith(req.body.commentId, req.body.newText);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment edited successfully', comment);
    });

    test('removeReview should remove a review', async () => {
        reviewService.removeReview.mockResolvedValue(true);

        await reviewController.removeReview(req, res);

        expect(reviewService.removeReview).toHaveBeenCalledWith(req.body.reviewId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Review removed successfully');
    });

    test('removeComment should remove a comment', async () => {
        reviewService.removeComment.mockResolvedValue(true);

        await reviewController.removeComment(req, res);

        expect(reviewService.removeComment).toHaveBeenCalledWith(req.body.commentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment removed successfully');
    });

    test('toggleLikeReview should like a review', async () => {
        reviewService.toggleLikeReview.mockResolvedValue(true);

        await reviewController.toggleLikeReview(req, res);

        expect(reviewService.toggleLikeReview).toHaveBeenCalledWith(req.body.userId, req.body.reviewId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Review liked successfully');
    });

    test('toggleLikeReview should remove like from a review', async () => {
        reviewService.toggleLikeReview.mockResolvedValue(false);

        await reviewController.toggleLikeReview(req, res);

        expect(reviewService.toggleLikeReview).toHaveBeenCalledWith(req.body.userId, req.body.reviewId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Like removed successfully');
    });
});
