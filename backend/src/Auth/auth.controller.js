import authService from './auth.services';
import responseHandler from '../utils/responseHandler';

exports.register = async (req, res) => {
    console.log("In the auth Controller");
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        responseHandler(res, 400, "Missing required fields: email, password, username");
        return;
    }

    try {
        const result = await authService.registerUser(email, password, username);
        console.log("Register User Result:", result);

        const { userRecord, customToken } = result;
        console.log("User:", userRecord);
        console.log("Custom Token:", customToken);

        responseHandler(res, 201, 'User registered successfully', { uid: userRecord.uid, username, token: customToken });
        console.log("User registration successful");
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { user, sessionCookie } = await authService.loginUser(email, password);
        res.cookie('session', sessionCookie, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 5 * 1000 });
        responseHandler(res, 200, 'User logged in successfully', { uid: user.uid, username: user.displayName });
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.logout = async (req, res) => {
    try {
        await authService.logoutUser();
        res.clearCookie('session');
        responseHandler(res, 200, 'User logged out successfully');
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};
