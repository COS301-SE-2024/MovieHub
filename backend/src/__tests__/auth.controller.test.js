// src/controllers/authController.test.js
import authController from '../Auth/auth.controller';
import authService from '../Auth/auth.services';
import responseHandler from '../utils/responseHandler';

jest.mock('../Auth/auth.services');
jest.mock('../utils/responseHandler');

describe('Auth Controller', () => {
    const mockReq = {
        body: {
            email: 'test@example.com',
            password: 'password123'
        }
    };
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('register should register a user', async () => {
        const user = { email: mockReq.body.email };
        authService.registerUser.mockResolvedValue(user);

        await authController.register(mockReq, mockRes);

        expect(authService.registerUser).toHaveBeenCalledWith(mockReq.body.email, mockReq.body.password);
        expect(responseHandler).toHaveBeenCalledWith(mockRes, 201, 'User registered successfully', user);
    });

    test('login should login a user', async () => {
        const user = { email: mockReq.body.email };
        authService.loginUser.mockResolvedValue(user);

        await authController.login(mockReq, mockRes);

        expect(authService.loginUser).toHaveBeenCalledWith(mockReq.body.email, mockReq.body.password);
        expect(responseHandler).toHaveBeenCalledWith(mockRes, 200, 'User logged in successfully', user);
    });

    test('logout should log out a user', async () => {
        authService.logoutUser.mockResolvedValue();

        await authController.logout(mockReq, mockRes);

        expect(authService.logoutUser).toHaveBeenCalled();
        expect(responseHandler).toHaveBeenCalledWith(mockRes, 200, 'User logged out successfully');
    });
});
