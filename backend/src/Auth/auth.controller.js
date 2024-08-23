import authService from './auth.services';
import responseHandler from '../utils/responseHandler';

exports.register = async (req, res) => {
    console.log("In the auth Controller");
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        res.status(400).json({ message: "Missing required fields: email, password, username" });
        return;
    }

    try {
        const result = await authService.registerUser(email, password, username);
        console.log("Register User Result:", result);

        const { userRecord, customToken } = result;
        console.log("User:", userRecord.uid);
        console.log("Custom Token:", customToken);

        responseHandler(res, 201, 'User registered successfully', { uid: userRecord.uid, username, token: customToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Missing required fields: email, password" });
        return;
    }
    try {
        const { user, customToken } = await authService.loginUser(email, password);
        if (!user || !customToken) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        res.cookie('session', customToken, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 5 * 1000 });
        responseHandler(res, 200, 'User logged in successfully', { uid: user.uid, username: user.displayName, token: customToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const logoutResult = await authService.logoutUser();
        if (!logoutResult) {
            res.status(400).json({ message: "Logout unsuccessful" });
            return;
        }
        res.clearCookie('session');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const isVerified = await authService.checkEmailVerification();
        if (isVerified) {
            res.status(200).json({ message: "Email verified" });
        } else {
            res.status(400).json({ message: "Email not verified" });
        }
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.isVerified = async (req, res) => {
    console.log("In the auth Controller");
    try {
        const isVerified = await authService.isUserVerified();
        if (isVerified) {
            res.status(200).json({ message: "Email verified", isVerified });
        } else {
            res.status(400).json({ message: "Email not verified", isVerified });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}