const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Login = require("../models/login");

router.post("/login", async (req, res) => {

    const { email, password, role } = req.body;
    console.log({ email, password, role });
    let dbuser = await Login.findOne({ email: email });

    if (dbuser != null) {
        let dbpass = dbuser.password;
        const passwordMatch = await bcrypt.compare(password, dbpass);
        if (passwordMatch) {
            if (role == dbuser.role) {
                res.status(200).json({
                    message: `${role} logged in successfully`,
                });
            } else {
                res.status(403).json({
                    message: `${role} not found with email: ${email}`
                });
            }
        } else {
            res.status(401).json({
                message: `Incorrect password for ${email}`
            });
        }
    } else {
        res.status(404).json({
            message: `${role} not found with email: ${email}`
        });
    }
});