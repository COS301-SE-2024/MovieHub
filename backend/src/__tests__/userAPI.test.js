import * as SecureStore from 'expo-secure-store';
import {
  getUserProfile, updateUserProfile, deleteUserProfile, changeMode, toggleMode, getMode,
  getUserWatchlists, getUserPublicWatchlists, getUserPosts, getCommentsOfUser, getReviewsOfUser,
  followUser, unfollowUser, getFriends, getFollowers, getFollowing, isFollowed, searchUser,
  getFollowersCount, getFollowingCount, getUserNotifications, getUnreadNotifications
} from '../../../frontend/src/Services/UsersApiService';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
);

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve('fake-token')),
}));

describe('UsersApiService Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getUserProfile should call the correct API', async () => {
    const response = await getUserProfile('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('updateUserProfile should call the correct API', async () => {
    const updatedData = { name: 'New Name', avatar: null };
    const response = await updateUserProfile('test_user', updatedData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('deleteUserProfile should call the correct API', async () => {
    const response = await deleteUserProfile('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('changeMode should call the correct API', async () => {
    const response = await changeMode('test_user', 'dark');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/mode'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('toggleMode should call the correct API', async () => {
    const response = await toggleMode('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/mode/toggle'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getMode should call the correct API', async () => {
    const response = await getMode('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/mode'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getUserWatchlists should call the correct API', async () => {
    const response = await getUserWatchlists('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/watchlists'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getUserPublicWatchlists should call the correct API', async () => {
    const response = await getUserPublicWatchlists('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/watchlists/public'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getUserPosts should call the correct API', async () => {
    const response = await getUserPosts('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/posts'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getCommentsOfUser should call the correct API', async () => {
    const response = await getCommentsOfUser('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/post/user/test_user/comments'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getReviewsOfUser should call the correct API', async () => {
    const response = await getReviewsOfUser('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/post/user/test_user/reviews'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('followUser should call the correct API', async () => {
    const request = { followerId: 'user1', followeeId: 'user2' };
    const response = await followUser(request);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/follow'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('unfollowUser should call the correct API', async () => {
    const request = { followerId: 'user1', followeeId: 'user2' };
    const response = await unfollowUser(request);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/unfollow'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getFriends should call the correct API', async () => {
    const response = await getFriends('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/friends/test_user'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getFollowers should call the correct API', async () => {
    const response = await getFollowers('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/followers'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getFollowing should call the correct API', async () => {
    const response = await getFollowing('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/following'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('isFollowed should call the correct API', async () => {
    const response = await isFollowed('user1', 'user2');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/user1/follows/user2'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('searchUser should call the correct API', async () => {
    const response = await searchUser('John');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/search/John'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getFollowersCount should call the correct API', async () => {
    const response = await getFollowersCount('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/followers/count'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getFollowingCount should call the correct API', async () => {
    const response = await getFollowingCount('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/following/count'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getUserNotifications should call the correct API', async () => {
    const response = await getUserNotifications('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/notifications'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getUnreadNotifications should call the correct API', async () => {
    const response = await getUnreadNotifications('test_user');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test_user/notifications/unread'), expect.any(Object));
    expect(response.success).toBe(true);
  });
});
