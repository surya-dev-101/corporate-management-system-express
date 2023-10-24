const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Login = require("../models/login");
const { generateToken, verifyToken } = require('../util/jwtUtil');
const Owner = require("../models/owner");
const Project = require("../models/project");
const Manager = require("../models/manager");
const Employee = require("../models/employee");
const Organization = require("../models/organization");
const nodemailer = require("nodemailer");


function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function sendEmail(email, otp) {
    // Use nodemailer to send an email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pandipanda2321@gmail.com",
            pass: "paibtajoscdqzmsj",
        },
    });

    const emailBody = `
      <p>Dear User,</p>
      <p>You have requested to reset your password. To complete the password reset process, please use the following One-Time Password (OTP):</p>
      <h3>${otp}</h3>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you for using our service.</p>
        `;

    const mailOptions = {
        from: "pandipanda2321@gmail.com",
        to: email,
        subject: "e-Corp | OTP for password reset",
        html: emailBody,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

router.get("/list", async (req, res) => {
    try {
        const login = await Login.find();
        res.status(200).json({ data: login, message: "List of logins" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/dashboard", async (req, res) => {
    try {
        const organizations = await Organization.find();
        const owners = await Owner.find();
        const projects = await Project.find();
        const managers = await Manager.find();
        const employees = await Employee.find();
        res.status(200).json({ data: { organizations, owners, projects, managers, employees }, message: "Dashboard" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

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
        const token = generateToken({ userId: user._id, role: user.role, email: user.email });
        user.token = token;
        await user.save();
        res.status(200).json({ message: "Login Successful", firstLogin: user.firstLogin, data: { email, role }, token: `${token}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post("/update-password", async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);
        const { userId, role, email } = decoded;
        const login = await Login.findById(userId);

        const user = await Login.findOne({ email });
        if (await bcrypt.compare(oldPassword, user.password)) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            if (role == "owner") {
                const owr = await Owner.findOne({ email: email })
                owr.password = hashedPassword;
                await owr.save();
            }
            else if (role == "manager") {
                const mgr = await Manager.findOne({ email: email })
                mgr.password = hashedPassword;
                await mgr.save();
            }
            else if (role == "employee") {
                const emp = await Employee.findOne({ email: email })
                emp.password = hashedPassword;
                await emp.save();
            }
            user.password = hashedPassword;
            login.firstLogin = false;
            await user.save();
            await login.save();
            res.status(200).json({ message: "Password updated successfully" });
        }
        else {
            res.status(400).json({ message: "Incorrect old password" });
        }
    }
    catch (err) {
        res.send(err)
    }
})

router.post("/request-otp", async (req, res) => {
    try {
        const { email, role } = req.body;
        let otp = generateOtp();
        console.log(otp);
        const login = await Login.findOne({ email: email });
        if (login != null) {
            const saltRounds = 10;
            const hashedOtp = await bcrypt.hash(otp.toString(), saltRounds);
            login.otp = hashedOtp;
            await login.save();

            if (role == "owner") {
                const owr = await Owner.findOne({ email: email })
                if (owr != null) {
                    await sendEmail(email, otp);
                    res.status(200).json({ message: `OTP sent to ${email}`, otp: otp })
                } else {
                    res.status(404).json({ message: `${role} not found with email: ${email}` })
                }
            }
            else if (role == "manager") {
                const mgr = await Manager.findOne({ email: email })
                if (mgr != null) {
                    await sendEmail(email, otp);
                    res.status(200).json({ message: `OTP sent to ${email}`, otp: otp })
                } else {
                    res.status(404).json({ message: `${role} not found with email: ${email}` })
                }
            }
            else if (role == "employee") {
                const emp = await Employee.findOne({ email: email })
                if (emp != null) {
                    await sendEmail(email, otp);
                    res.status(200).json({ message: `OTP sent to ${email}`, otp: otp })
                } else {
                    res.status(404).json({ message: `${role} not found with email: ${email}` })
                }
            }
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = router;