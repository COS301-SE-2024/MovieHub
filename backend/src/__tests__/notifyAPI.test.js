import * as SecureStore from 'expo-secure-store';
import {
  markNotificationAsRead,
  deleteNotification,
  clearNotifications
} from '../../../frontend/src/Services/NotifyApiService'; // Adjust the path if needed

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve('fake-token')),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

describe('NotificationApiService Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('markNotificationAsRead should call the correct API', async () => {
    const userId = 'test_user';
    const type = 'message';
    const notificationId = 'notification123';

    await markNotificationAsRead(userId, type, notificationId);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/${userId}/${type}/${notificationId}/read`), expect.any(Object));
  });

  test('deleteNotification should call the correct API', async () => {
    const userId = 'test_user';
    const type = 'message';
    const notificationId = 'notification123';

    await deleteNotification(userId, type, notificationId);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/${userId}/${type}/${notificationId}`), expect.any(Object));
  });

  test('clearNotifications should call the correct API', async () => {
    const userId = 'test_user';
    const type = 'message'; // Ensure this variable is defined or passed correctly

    await clearNotifications(userId);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/${userId}/${type}`), expect.any(Object));
  });
});
