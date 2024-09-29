import {
    createWatchlist, modifyWatchlist, getWatchlistDetails, getCollaborators,
    deleteWatchlist, getFollowedUsersWatchlists
  } from '../../../frontend/src/Services/ListApiService'; // Assuming this is the file name for the service
  import { uploadImage } from '../../../frontend/src/Services/imageUtils';
  import { getToken } from '../../../frontend/src/Services/authUtils'; // Assuming this is where getToken is
  
  jest.mock('../imageUtils', () => ({
    uploadImage: jest.fn(() => Promise.resolve('https://mocked-image-url.com')),
  }));
  
  jest.mock('../authUtils', () => ({
    getToken: jest.fn(() => Promise.resolve('mocked-token')),
  }));
  
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
    })
  );
  
  describe('WatchlistApiService Integration Tests', () => {
    beforeEach(() => {
      fetch.mockClear();
      uploadImage.mockClear();
      getToken.mockClear();
    });
  
    // Test createWatchlist
    test('createWatchlist should call the correct API and upload image if provided', async () => {
      const userId = 'test_user';
      const watchlistData = { name: 'Test Watchlist', img: 'https://example.com/image.jpg' };
  
      const response = await createWatchlist(userId, watchlistData);
      
      expect(uploadImage).toHaveBeenCalledWith(watchlistData.img, 'lists');
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/list/${userId}`), expect.any(Object));
      expect(response.success).toBe(true);
    });
  
    test('createWatchlist should call the correct API and use default image if img is null', async () => {
      const userId = 'test_user';
      const watchlistData = { name: 'Test Watchlist', img: null };
  
      const response = await createWatchlist(userId, watchlistData);
      
      expect(uploadImage).not.toHaveBeenCalled();
      expect(watchlistData.img).toBe('https://picsum.photos/seed/picsum/20/300');
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/list/${userId}`), expect.any(Object));
      expect(response.success).toBe(true);
    });
  
    // Test modifyWatchlist
    test('modifyWatchlist should call the correct API', async () => {
      const watchlistId = 'test_watchlist';
      const updatedData = { name: 'Updated Watchlist' };
  
      const response = await modifyWatchlist(watchlistId, updatedData);
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/list/${watchlistId}`), expect.any(Object));
      expect(response.success).toBe(true);
    });
  
    // Test getWatchlistDetails
    test('getWatchlistDetails should call the correct API', async () => {
      const watchlistId = 'test_watchlist';
      
      const response = await getWatchlistDetails(watchlistId);
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/list/${watchlistId}`), expect.any(Object));
      expect(response.success).toBe(true);
    });
  
    // Test getCollaborators
    test('getCollaborators should call the correct API and return collaborators', async () => {
      const watchlistId = 'test_watchlist';
      
      const response = await getCollaborators(watchlistId);
      
      expect(getToken).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/list/${watchlistId}/collaborators`), expect.any(Object));
      expect(response.success).toBe(true);
    });
  
    // Test deleteWatchlist
    test('deleteWatchlist should call the correct API', async () => {
      const watchlistId = 'test_watchlist';
      
      await deleteWatchlist(watchlistId);
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/list/${watchlistId}`), expect.any(Object));
    });
  
    // Test getFollowedUsersWatchlists
    test('getFollowedUsersWatchlists should call the correct API', async () => {
      const userId = 'test_user';
      
      const response = await getFollowedUsersWatchlists(userId);
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/list/${userId}/followed-watchlists`), expect.any(Object));
      expect(response.success).toBe(true);
    });
  });
  