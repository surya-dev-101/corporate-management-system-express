const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Login = require("../models/login");
const { generateToken } = require('../util/jwtUtil');

router.get("/list", async (req, res) => {
    try {
        const login = await Login.find();
        res.status(200).json({ data: login, message: "List of logins" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await Login.findOne({ email });
        if (!user)
            return res.status(401).json({ message: `${role} not found with email: ${email} ` });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: `Incorrect password for ${email}` })
        if (role != user.role)
            return res.status(401).json({ message: `${role} not found with email: ${email} ` })
        const token = generateToken({ userId: user._id, role: user.role });
        user.token = token;
        await user.save();
        res.status(200).json({ message: "Login Successful", data: { email, role }, token: `Bearer ${token}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;