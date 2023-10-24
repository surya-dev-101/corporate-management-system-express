const express = require('express');

const router = express.Router();
const Manager = require("../models/manager");
const bcrypt = require('bcryptjs');
const Login = require("../models/login");

router.get("/list", async (req, res) => {
    try {
        const managers = await Manager.find().select("-password");
        res.status(200).json({ data: managers, message: "List of managers" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/registration", async (req, res) => {
    try {
        const manager = new Manager(req.body);
        let emanager = await Manager.findOne({ email: manager.email });
        if (emanager != null) {
            res.status(400).json({
                message: `Manager already exists with email: ${manager.email}`
            });
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(manager.password, saltRounds);
            manager.password = hashedPassword;
            const login = new Login({ email: manager.email, password: manager.password, role: "manager" });
            await login.save();
            await manager.save();
            res.status(201).json({ data: manager, message: "Manager created successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;