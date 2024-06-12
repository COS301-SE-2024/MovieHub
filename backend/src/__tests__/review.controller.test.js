import reviewService from'../Review/review.services';
import responseHandler from'../utils/responseHandler';
import reviewController from'../Review/review.controller';

jest.mock('../Review/review.services');
jest.mock('../utils/responseHandler');

describe('Review Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('addReview should add a review', async () => {
        req.body = { userId: 'user1', movieId: 'movie1', text: 'Great movie!' };
        const review = { id: 'review1', text: 'Great movie!' };
        reviewService.addReview.mockResolvedValue(review);

        await reviewController.addReview(req, res);

        expect(reviewService.addReview).toHaveBeenCalledWith(req.body.userId, req.body.movieId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Review added successfully', review);
    });

    test('addCommentToReview should add a comment to a review', async () => {
        req.body = { userId: 'user1', reviewId: 'review1', movieId: 'movie1', text: 'I agree!' };
        const comment = { id: 'comment1', text: 'I agree!', movieId: 'movie1' };
        reviewService.addCommentToReview.mockResolvedValue(comment);

        await reviewController.addCommentToReview(req, res);

        expect(reviewService.addCommentToReview).toHaveBeenCalledWith(req.body.userId, req.body.reviewId, req.body.movieId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Comment added successfully', comment);
    });

    test('addCommentToComment should add a comment to a comment', async () => {
        req.body = { userId: 'user1', commentId: 'comment1', movieId: 'movie1', text: 'I agree!' };
        const comment = { id: 'comment2', text: 'I agree!', movieId: 'movie1' };
        reviewService.addCommentToComment.mockResolvedValue(comment);

        await reviewController.addCommentToComment(req, res);

        expect(reviewService.addCommentToComment).toHaveBeenCalledWith(req.body.userId, req.body.commentId, req.body.movieId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Comment added successfully', comment);
    });

    test('editReview should edit a review', async () => {
        req.body = { reviewId: 'review1', text: 'Updated text' };
        const review = { id: 'review1', text: 'Updated text' };
        reviewService.editReview.mockResolvedValue(review);

        await reviewController.editReview(req, res);

        expect(reviewService.editReview).toHaveBeenCalledWith(req.body.reviewId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Review edited successfully', review);
    });

    test('editComment should edit a comment', async () => {
        req.body = { commentId: 'comment1', text: 'Updated text' };
        const comment = { id: 'comment1', text: 'Updated text' };
        reviewService.editComment.mockResolvedValue(comment);

        await reviewController.editComment(req, res);

        expect(reviewService.editComment).toHaveBeenCalledWith(req.body.commentId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment edited successfully', comment);
    });

    test('removeReview should remove a review', async () => {
        req.body = { reviewId: 'review1' };
        reviewService.removeReview.mockResolvedValue(true);

        await reviewController.removeReview(req, res);

        expect(reviewService.removeReview).toHaveBeenCalledWith(req.body.reviewId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Review removed successfully');
    });

    test('removeComment should remove a comment', async () => {
        req.body = { commentId: 'comment1' };
        reviewService.removeComment.mockResolvedValue(true);

        await reviewController.removeComment(req, res);

        expect(reviewService.removeComment).toHaveBeenCalledWith(req.body.commentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment removed successfully');
    });

    test('toggleLikeReview should like/unlike a review', async () => {
        req.body = { userId: 'user1', reviewId: 'review1' };
        reviewService.toggleLikeReview.mockResolvedValue(true);

        await reviewController.toggleLikeReview(req, res);

        expect(reviewService.toggleLikeReview).toHaveBeenCalledWith(req.body.userId, req.body.reviewId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Review liked successfully', { liked: true });
    });

    test('getReviewsOfMovie should fetch reviews of a specific movie', async () => {
        req.params = { movieId: 'movie1' };
        const reviews = [{ id: 'review1', text: 'Great movie!' }];
        reviewService.getReviewsOfMovie.mockResolvedValue(reviews);

        await reviewController.getReviewsOfMovie(req, res);

        expect(reviewService.getReviewsOfMovie).toHaveBeenCalledWith(req.params.movieId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Reviews fetched successfully', reviews);
    });

    test('getCommentsOfReview should fetch comments of a specific review', async () => {
        req.params = { reviewId: 'review1' };
        const comments = [{ id: 'comment1', text: 'I agree!' }];
        reviewService.getCommentsOfReview.mockResolvedValue(comments);

        await reviewController.getCommentsOfReview(req, res);

        expect(reviewService.getCommentsOfReview).toHaveBeenCalledWith(req.params.reviewId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comments fetched successfully', comments);
    });

    test('getReviewsOfUser should fetch reviews of a specific user', async () => {
        req.params = { userId: 'user1' };
        const reviews = [{ id: 'review1', text: 'Great movie!' }];
        reviewService.getReviewsOfUser.mockResolvedValue(reviews);

        await reviewController.getReviewsOfUser(req, res);

        expect(reviewService.getReviewsOfUser).toHaveBeenCalledWith(req.params.userId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Reviews fetched successfully', reviews);
    });

    test('getCommentsOfUser should fetch comments of a specific user', async () => {
        req.params = { userId: 'user1' };
        const comments = [{ id: 'comment1', text: 'I agree!' }];
        reviewService.getCommentsOfUser.mockResolvedValue(comments);

        await reviewController.getCommentsOfUser(req, res);

        expect(reviewService.getCommentsOfUser).toHaveBeenCalledWith(req.params.userId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comments fetched successfully', comments);
    });
});