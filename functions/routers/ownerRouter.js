// create router for owner model

const express = require("express");
const router = express.Router();
const Owner = require("../models/owner");
const bcrypt = require('bcryptjs');
const Login = require("../models/login");
const nodemailer = require("nodemailer");


async function sendEmail(email, name) {
    // Use nodemailer to send an email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pandipanda2321@gmail.com",
            pass: "paibtajoscdqzmsj",
        },
    });

    const emailBody = `
        <p>Hello, ${name}</p>
        <p>You have been registered as an owner by e-corp admin.</p> 
        <p>Please use the below details to login and update your password:</p>
        <p>Email: ${email}</p>
        <p>One time password: <h3>Password@123</h3></p>
        <p>Login link: <a href=" https://frolicking-jalebi-19c50f.netlify.app">e-Corp | Login</a></p>
        <p>Thank you!</p>
        <p>e-Corp | Admin</p>
        `;

    const mailOptions = {
        from: "pandipanda2321@gmail.com",
        to: email,
        subject: "e-Corp | Owner Registration Successfull",
        html: emailBody,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// get all owners
router.get("/list", async (req, res) => {
    try {
        const owners = await Owner.find()//.select("-password");
        res.status(200).json({ data: owners, message: "List of owners" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// post a new owner
router.post("/registration", async (req, res) => {
    try {
        const owner = new Owner(req.body);
        owner.password = "Password@123"

        let eowner = await Owner.findOne({ email: owner.email });
        console.log("eowner: " + eowner);
        if (eowner != null) {
            res.status(400).json({
                message: `Owner already exists with email: ${owner.email}`
            });
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(owner.password, saltRounds);
            owner.password = hashedPassword;
            console.log("owner: " + owner);
            const login = new Login({ email: owner.email, password: owner.password, role: "owner" });
            await login.save();
            await owner.save();
            await sendEmail(owner.email, owner.firstName);
            
            res.status(201).json({ data: owner, message: "Owner created successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;