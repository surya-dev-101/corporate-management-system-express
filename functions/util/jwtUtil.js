const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY || "mrpanda@101", { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY || "mrpanda@101");
};

module.exports = { generateToken, verifyToken };
