import * as SecureStore from 'expo-secure-store';
import {
  getUserLikedPosts, getLikesOfMovie, getLikesOfComment,
  getLikesOfReview, getLikesOfPost, toggleLikeReview, 
  toggleLikeComment, toggleLikeMovie, toggleLikePost, 
  checkUserLike
} from '../LikesApiService'; // Adjust the path if needed

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve('fake-token')),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
);

describe('LikesApiService Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getUserLikedPosts should call the correct API', async () => {
    const userId = 'test_user';
    const response = await getUserLikedPosts(userId);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/like/${userId}/likes`), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getLikesOfMovie should call the correct API', async () => {
    const movieId = 'movie123';
    const response = await getLikesOfMovie(movieId);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/like/movie/${movieId}`), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getLikesOfComment should call the correct API', async () => {
    const commentId = 'comment123';
    const response = await getLikesOfComment(commentId);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/like/comment/${commentId}`), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getLikesOfReview should call the correct API', async () => {
    const reviewId = 'review123';
    const response = await getLikesOfReview(reviewId);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/like/review/${reviewId}`), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getLikesOfPost should call the correct API', async () => {
    const postId = 'post123';
    const response = await getLikesOfPost(postId);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/like/post/${postId}`), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('toggleLikeReview should call the correct API', async () => {
    const bodyData = { userId: 'test_user', reviewId: 'review123' };
    const response = await toggleLikeReview(bodyData);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/like/toggleLikeReview'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('toggleLikeComment should call the correct API', async () => {
    const bodyData = { userId: 'test_user', commentId: 'comment123' };
    const response = await toggleLikeComment(bodyData);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/like/toggleLikeComment'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('toggleLikeMovie should call the correct API', async () => {
    const bodyData = { userId: 'test_user', movieId: 'movie123' };
    const response = await toggleLikeMovie(bodyData);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/like/toggleLikeMovie'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('toggleLikePost should call the correct API', async () => {
    const bodyData = { userId: 'test_user', postId: 'post123' };
    const response = await toggleLikePost(bodyData);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/like/toggleLikePost'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('checkUserLike should call the correct API', async () => {
    const uid = 'test_user';
    const entityId = 'entity123';
    const entityType = 'post'; // or 'review', 'comment', etc.
    const response = await checkUserLike(uid, entityId, entityType);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/like/check-like/${uid}/${entityId}/${entityType}`), expect.any(Object));
    expect(response.success).toBe(true);
  });
});
