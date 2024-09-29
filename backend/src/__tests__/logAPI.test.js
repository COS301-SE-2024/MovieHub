import * as SecureStore from 'expo-secure-store';
import {
  addLog,
  editLog,
  removeLog,
  getLogsOfUser
} from '../../../frontend/src/Services/LogApiService'; // Adjust the path if needed

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve('fake-token')),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
    ok: true,
  })
);

describe('LogApiService Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('addLog should call the correct API', async () => {
    const logData = { message: 'This is a log' };
    const response = await addLog(logData);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/log/add'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('editLog should call the correct API', async () => {
    const logData = { logId: '12345', message: 'Updated log' };
    const response = await editLog(logData);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/log/edit'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('removeLog should call the correct API', async () => {
    const logData = { logId: '12345' };
    const response = await removeLog(logData);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/log/remove'), expect.any(Object));
    expect(response.success).toBe(true);
  });

  test('getLogsOfUser should call the correct API', async () => {
    const uid = 'test_user';
    const response = await getLogsOfUser(uid);
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/log/user/${uid}`), expect.any(Object));
    expect(response.success).toBe(true);
  });
});
