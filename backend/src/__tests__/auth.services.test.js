// src/services/authService.test.js
const authService = require('../Auth/auth.services');
const { mockAuth } = require('../__mock__/auth.firebase');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } = require('firebase/auth');

jest.mock('firebase/auth');
jest.mock('../Firebase/firebaseConnection');

describe('Auth Service', () => {
  const email = 'test@example.com';
  const password = 'password123';
  const userCredential = { user: { email, displayName: 'Test User' } };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser should register a user', async () => {
    createUserWithEmailAndPassword.mockResolvedValue(userCredential);

    const user = await authService.registerUser(email, password);

    expect(user).toBeDefined();
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), email, password);
  });

  test('loginUser should login a user', async () => {
    signInWithEmailAndPassword.mockResolvedValue(userCredential);

    const user = await authService.loginUser(email, password);

    expect(user).toBeDefined();
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), email, password);
  });

  test('logoutUser should log out a user', async () => {
    signOut.mockResolvedValue();

    const out = await authService.logoutUser();

    expect(out).toEqual(true);
    expect(signOut).toHaveBeenCalledWith(expect.anything());
  });

  test('signUpWithGoogle should sign up a user with Google', async () => {
    signInWithPopup.mockResolvedValue(userCredential);

    const user = await authService.signUpWithGoogle();

    expect(user).toBeDefined();
    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), expect.anything());
  });

  test('loginWithGoogle should log in a user with Google', async () => {
    signInWithPopup.mockResolvedValue(userCredential);

    const user = await authService.loginWithGoogle();

    expect(user).toBeDefined();
    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), expect.anything());
  });

  test('signUpWithApple should sign up a user with Apple', async () => {
    signInWithPopup.mockResolvedValue(userCredential);

    const user = await authService.signUpWithApple();

    expect(user).toBeDefined();
    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), expect.anything());
  });

  test('loginWithApple should log in a user with Apple', async () => {
    signInWithPopup.mockResolvedValue(userCredential);

    const user = await authService.loginWithApple();

    expect(user).toBeDefined();
    expect(signInWithPopup).toHaveBeenCalledWith(expect.anything(), expect.anything());
  });
});
