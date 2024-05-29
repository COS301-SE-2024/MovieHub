const authService = require('./auth.services');

exports.signUp = async (req, res) => {
    const userEmail = req.params.userEmail;
    const userPassword = req.params.userPassword;
    try {
        const user = await authService.signUp(userEmail, userPassword);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error signing up', error });
    }
};

exports.logIn = async (req, res) => {
    const userEmail = req.params.userEmail;
    const userPassword = req.params.userPassword;
    try {
        const user = await authService.logIn(userEmail, userPassword);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error logging user in', error });
    }
};

exports.logOut = async (req, res) => {
    try {
        const status = await authService.logOut();
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
};
