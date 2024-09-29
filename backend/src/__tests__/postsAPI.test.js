import * as SecureStore from 'expo-secure-store';
import {
  addPost, addReview, addCommentToPost, addCommentToReview, addCommentToComment,
  editPost, editReview, editComment, removePost, removeReview, removeComment,
  getPostsOfMovie, getReviewsOfMovie, isReviewed, getCommentsOfPost, getCommentsOfReview,
  getCommentsOfComment, getPostsOfUser, getReviewsOfUser, getCommentsOfUser, 
  getAverageRating, getCountCommentsOfPost, getCountCommentsOfReview
} from '../../../frontend/src/Services/PostsApiServices';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
);

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve('fake-token')),
}));

describe('PostsApiServices Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  // Test addPost
  test('addPost should call the correct API', async () => {
    const bodyData = { uid: 'test_uid', text: 'test post', postTitle: 'Test', img: null };
    const response = await addPost(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/add/post'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test addReview
  test('addReview should call the correct API', async () => {
    const bodyData = { uid: 'test_uid', movieId: '12345', text: 'test review', img: null, rating: 5, reviewTitle: 'Great Movie', movieTitle: 'Some Movie' };
    const response = await addReview(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/add/review'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test addCommentToPost
  test('addCommentToPost should call the correct API', async () => {
    const bodyData = { uid: 'test_uid', text: 'comment on post', postId: '12345' };
    const response = await addCommentToPost(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/comment/post'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test addCommentToReview
  test('addCommentToReview should call the correct API', async () => {
    const bodyData = { uid: 'test_uid', text: 'comment on review', reviewId: '12345' };
    const response = await addCommentToReview(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/comment/review'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test addCommentToComment
  test('addCommentToComment should call the correct API', async () => {
    const bodyData = { uid: 'test_uid', text: 'reply to comment', comOnId: 'comment123' };
    const response = await addCommentToComment(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/comment/comment'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test editPost
  test('editPost should call the correct API', async () => {
    const bodyData = { postId: '12345', uid: 'test_uid', text: 'updated text', img: null };
    const response = await editPost(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/edit/post'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test editReview
  test('editReview should call the correct API', async () => {
    const bodyData = { reviewId: '12345', uid: 'test_uid', text: 'updated review', img: null, reviewTitle: 'Updated Title', rating: 4 };
    const response = await editReview(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/edit/review'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test editComment
  test('editComment should call the correct API', async () => {
    const bodyData = { commentId: 'comment123', uid: 'test_uid', text: 'updated comment' };
    const response = await editComment(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/edit/comment'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test removePost
  test('removePost should call the correct API', async () => {
    const bodyData = { postId: '12345', uid: 'test_uid' };
    const response = await removePost(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/remove/post'), expect.any(Object));
    expect(response).toBe(true);
  });

  // Test removeReview
  test('removeReview should call the correct API', async () => {
    const bodyData = { reviewId: '12345', uid: 'test_uid' };
    const response = await removeReview(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/remove/review'), expect.any(Object));
    expect(response).toBe(true);
  });

  // Test removeComment
  test('removeComment should call the correct API', async () => {
    const bodyData = { commentId: 'comment123', uid: 'test_uid' };
    const response = await removeComment(bodyData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/remove/comment'), expect.any(Object));
    expect(response).toBe(true);
  });

  // Test getPostsOfMovie
  test('getPostsOfMovie should call the correct API', async () => {
    const response = await getPostsOfMovie('movie123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/movie/movie123/posts'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getReviewsOfMovie
  test('getReviewsOfMovie should call the correct API', async () => {
    const response = await getReviewsOfMovie('movie123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/movie/movie123/reviews'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test isReviewed
  test('isReviewed should call the correct API', async () => {
    const response = await isReviewed('test_uid', 'movie123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/movie/test_uid/movie123/reviews'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getCommentsOfPost
  test('getCommentsOfPost should call the correct API', async () => {
    const response = await getCommentsOfPost('post123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/post/post123/comments'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getCommentsOfReview
  test('getCommentsOfReview should call the correct API', async () => {
    const response = await getCommentsOfReview('review123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/review/review123/comments'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getCommentsOfComment
  test('getCommentsOfComment should call the correct API', async () => {
    const response = await getCommentsOfComment('comment123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/comment/comment123/comments'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getPostsOfUser
  test('getPostsOfUser should call the correct API', async () => {
    const response = await getPostsOfUser('test_uid');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/user/test_uid/posts'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getReviewsOfUser
  test('getReviewsOfUser should call the correct API', async () => {
    const response = await getReviewsOfUser('test_uid');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/user/test_uid/reviews'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getCommentsOfUser
  test('getCommentsOfUser should call the correct API', async () => {
    const response = await getCommentsOfUser('test_uid');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/user/test_uid/comments'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getAverageRating
  test('getAverageRating should call the correct API', async () => {
    const response = await getAverageRating('movie123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/movie/movie123/rating'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getCountCommentsOfPost
  test('getCountCommentsOfPost should call the correct API', async () => {
    const response = await getCountCommentsOfPost('post123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/post/post123/comment/count'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  // Test getCountCommentsOfReview
  test('getCountCommentsOfReview should call the correct API', async () => {
    const response = await getCountCommentsOfReview('review123');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/review/review123/comment/count'), expect.any(Object));
    expect(response.success).toBe(true);
  });
});
