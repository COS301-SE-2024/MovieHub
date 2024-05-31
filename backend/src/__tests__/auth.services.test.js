// src/services/authService.test.js
import authService from '../Auth/auth.services';
import { mockAuth } from '../__mock__/auth.firebase';

describe('Auth Service', () => {
  const email = 'test@example.com';
  const password = 'password123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser should register a user', async () => {
    const userCredential = { user: { email } };
    mockAuth.createUserWithEmailAndPassword.mockResolvedValue(userCredential);

    const user = await authService.registerUser(email, password);

    expect(user).toEqual(userCredential.user);
    expect(mockAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, password);
  });

  test('loginUser should login a user', async () => {
    const userCredential = { user: { email } };
    mockAuth.signInWithEmailAndPassword.mockResolvedValue(userCredential);

    const user = await authService.loginUser(email, password);

    expect(user).toEqual(userCredential.user);
    expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, password);
  });

  test('logoutUser should log out a user', async () => {
    mockAuth.signOut.mockResolvedValue();

    await authService.logoutUser();

    expect(mockAuth.signOut).toHaveBeenCalledWith(mockAuth);
  });
});
