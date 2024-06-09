import authService from './auth.services';
import responseHandler from '../utils/responseHandler';
import authController from './auth.controller';

jest.mock('./auth.services');
jest.mock('../utils/responseHandler');

describe('Auth Controller', () => {
  const req = { body: { email: 'test@example.com', password: 'password123' } };
  const res = {};

  beforeEach(() => {
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    jest.clearAllMocks();
  });

  test('register should register a user', async () => {
    const user = { email: req.body.email };
    authService.registerUser.mockResolvedValue(user);

    await authController.register(req, res);

    expect(authService.registerUser).toHaveBeenCalledWith(req.body.email, req.body.password);
    expect(responseHandler).toHaveBeenCalledWith(res, 201, 'User registered successfully', user);
  });

  test('register should handle errors', async () => {
    const errorMessage = 'Registration error';
    authService.registerUser.mockRejectedValue(new Error(errorMessage));

    await authController.register(req, res);

    expect(authService.registerUser).toHaveBeenCalledWith(req.body.email, req.body.password);
    expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
  });

  test('login should log in a user', async () => {
    const user = { email: req.body.email };
    authService.loginUser.mockResolvedValue(user);

    await authController.login(req, res);

    expect(authService.loginUser).toHaveBeenCalledWith(req.body.email, req.body.password);
    expect(responseHandler).toHaveBeenCalledWith(res, 200, 'User logged in successfully', user);
  });

  test('login should handle errors', async () => {
    const errorMessage = 'Login error';
    authService.loginUser.mockRejectedValue(new Error(errorMessage));

    await authController.login(req, res);

    expect(authService.loginUser).toHaveBeenCalledWith(req.body.email, req.body.password);
    expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
  });

  test('logout should log out a user', async () => {
    authService.logoutUser.mockResolvedValue(true);

    await authController.logout(req, res);

    expect(authService.logoutUser).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 200, 'User logged out successfully');
  });

  test('logout should handle errors', async () => {
    const errorMessage = 'Logout error';
    authService.logoutUser.mockRejectedValue(new Error(errorMessage));

    await authController.logout(req, res);

    expect(authService.logoutUser).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
  });

  test('signUpWithGoogle should sign up a user with Google', async () => {
    const user = { email: 'googleuser@example.com' };
    authService.signUpWithGoogle.mockResolvedValue(user);

    await authController.signUpWithGoogle(req, res);

    expect(authService.signUpWithGoogle).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 200, 'User signed up with Google successfully', user);
  });

  test('signUpWithGoogle should handle errors', async () => {
    const errorMessage = 'Google signup error';
    authService.signUpWithGoogle.mockRejectedValue(new Error(errorMessage));

    await authController.signUpWithGoogle(req, res);

    expect(authService.signUpWithGoogle).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
  });

  test('loginWithGoogle should log in a user with Google', async () => {
    const user = { email: 'googleuser@example.com' };
    authService.loginWithGoogle.mockResolvedValue(user);

    await authController.loginWithGoogle(req, res);

    expect(authService.loginWithGoogle).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 200, 'User logged in with Google successfully', user);
  });

  test('loginWithGoogle should handle errors', async () => {
    const errorMessage = 'Google login error';
    authService.loginWithGoogle.mockRejectedValue(new Error(errorMessage));

    await authController.loginWithGoogle(req, res);

    expect(authService.loginWithGoogle).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
  });

  test('signUpWithApple should sign up a user with Apple', async () => {
    const user = { email: 'appleuser@example.com' };
    authService.signUpWithApple.mockResolvedValue(user);

    await authController.signUpWithApple(req, res);

    expect(authService.signUpWithApple).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 200, 'User signed up with Apple successfully', user);
  });

  test('signUpWithApple should handle errors', async () => {
    const errorMessage = 'Apple signup error';
    authService.signUpWithApple.mockRejectedValue(new Error(errorMessage));

    await authController.signUpWithApple(req, res);

    expect(authService.signUpWithApple).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
  });

  test('loginWithApple should log in a user with Apple', async () => {
    const user = { email: 'appleuser@example.com' };
    authService.loginWithApple.mockResolvedValue(user);

    await authController.loginWithApple(req, res);

    expect(authService.loginWithApple).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 200, 'User logged in with Apple successfully', user);
  });

  test('loginWithApple should handle errors', async () => {
    const errorMessage = 'Apple login error';
    authService.loginWithApple.mockRejectedValue(new Error(errorMessage));

    await authController.loginWithApple(req, res);

    expect(authService.loginWithApple).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith(res, 400, errorMessage);
  });
});
