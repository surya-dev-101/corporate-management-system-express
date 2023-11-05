const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Login = require("../models/login");
const nodemailer = require("nodemailer");
const Owner = require("../models/owner");
const Project = require("../models/project");
const Manager = require("../models/manager");
const Employee = require("../models/employee");

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function sendEmail(email, otp) {
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

router.post("/requestOtp", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const { email, role } = req.body;
        let otp = generateOtp();
        console.log(otp);
        const login = await Login.findOne({ email: email, role: role });
        if (login != null) {
            const saltRounds = 10;
            const hashedOtp = await bcrypt.hash(otp.toString(), saltRounds);
            login.otp = hashedOtp;
            await login.save();
            await sendEmail(email, otp);
            res.status(200).json({ message: `OTP sent to ${email}`, otp: otp, email: email, role: role })

            // if (role == "owner") {
            //     const owr = await Owner.findOne({ email: email })
            //     if (owr != null) {
            //     } else {
            //         res.status(404).json({ message: `${role} not found with email: ${email}` })
            //     }
            // }
            // else if (role == "manager") {
            //     const mgr = await Manager.findOne({ email: email })
            //     if (mgr != null) {
            //         await sendEmail(email, otp);
            //         res.status(200).json({ message: `OTP sent to ${email}`, otp: otp })
            //     } else {
            //         res.status(404).json({ message: `${role} not found with email: ${email}` })
            //     }
            // }
            // else if (role == "employee") {
            //     const emp = await Employee.findOne({ email: email })
            //     if (emp != null) {
            //         await sendEmail(email, otp);
            //         res.status(200).json({ message: `OTP sent to ${email}`, otp: otp })
            //     } else {
            //         res.status(404).json({ message: `${role} not found with email: ${email}` })
            //     }
            // }
        } else {
            res.status(404).json({ message: `${role} not found with email: ${email}` })
        }
    } catch (err) {
        console.log(err);
        res.send(err)
    }
})

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, role, otp } = req.body;
        const login = await Login.findOne({ email: email, role: role });
        if (login != null) {
            if (await bcrypt.compare(otp.toString(), login.otp)) {
                login.otp = "";
                await login.save();
                res.status(200).json({ message: "OTP verified successfully" });
            } else {
                res.status(400).json({ message: "Incorrect OTP" });
            }
        } else {
            res.status(404).json({ message: `${role} not found with email: ${email}` });
        }

    } catch (err) {
        res.status(500).send(err)
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { email, role, newPassword } = req.body;
        const login = await Login.findOne({ email: email });

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
        login.password = hashedPassword;
        await login.save();
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (err) {
        res.send(err)
    }
})

module.exports = router;