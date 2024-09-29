import * as SecureStore from 'expo-secure-store';
import {
  getFriendsContent,
  getFriendsOfFriendsContent,
  getRandomUsersContent,
  findUsers,
  getLatestPosts,
  getTopReviews
} from '../../../frontend/src/Services/ExploreApiService'; // Adjust the path if needed

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve('fake-token')),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
);

describe('ExploreApiService Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getFriendsContent should call the correct API', async () => {
    const userInfo = { userId: 'test_user' };
    const response = await getFriendsContent(userInfo);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/friends-content'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getFriendsOfFriendsContent should call the correct API', async () => {
    const userInfo = { userId: 'test_user' };
    const response = await getFriendsOfFriendsContent(userInfo);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/friends-of-friends-content'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getRandomUsersContent should call the correct API', async () => {
    const userInfo = { userId: 'test_user' };
    const response = await getRandomUsersContent(userInfo);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/random-users-content'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('findUsers should call the correct API', async () => {
    const userInfo = { userId: 'test_user' };
    const response = await findUsers(userInfo);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/find-users'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getLatestPosts should call the correct API', async () => {
    const response = await getLatestPosts();
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/latest-posts'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getTopReviews should call the correct API', async () => {
    const response = await getTopReviews();
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/top-reviews'), expect.any(Object));
    expect(response.success).toBe(true);
  });
});
