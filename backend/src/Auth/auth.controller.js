import authService from './auth.services';
import responseHandler from '../utils/responseHandler';

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authService.registerUser(email, password);
        responseHandler(res, 201, 'User registered successfully', user);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authService.loginUser(email, password);
        responseHandler(res, 200, 'User logged in successfully', user);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.logout = async (req, res) => {
    try {
        await authService.logoutUser();
        responseHandler(res, 200, 'User logged out successfully');
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.signUpWithGoogle = async (req, res) => {
    try {
        const user = await authService.signUpWithGoogle();
        responseHandler(res, 200, 'User signed up with Google successfully', user);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.loginWithGoogle = async (req, res) => {
    try {
        const user = await authService.loginWithGoogle();
        responseHandler(res, 200, 'User logged in with Google successfully', user);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.signUpWithApple = async (req, res) => {
    try {
        const user = await authService.signUpWithApple();
        responseHandler(res, 200, 'User signed up with Apple successfully', user);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.loginWithApple = async (req, res) => {
    try {
        const user = await authService.loginWithApple();
        responseHandler(res, 200, 'User logged in with Apple successfully', user);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};
