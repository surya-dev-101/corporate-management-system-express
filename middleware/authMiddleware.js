const { verifyToken } = require('../util/jwtUtil');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    try {
        const decodedToken = verifyToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports = authMiddleware;
