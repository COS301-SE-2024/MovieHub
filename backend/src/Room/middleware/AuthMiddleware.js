const admin = require('firebase-admin');

const verifyFirebaseToken = async (req, res, next) => {
    const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = verifyFirebaseToken;
