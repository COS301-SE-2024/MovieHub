
import authService from './auth.services';
import responseHandler from '../utils/responceHandler';

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
