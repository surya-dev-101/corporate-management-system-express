const express = require('express');

const router = express.Router();
const Employee = require("../models/employee");
const bcrypt = require('bcryptjs');
const Login = require("../models/login");

router.get("/list", async (req, res) => {
    try {
        const employees = await Employee.find().select("-password");
        res.status(200).json({ data: employees, message: "List of employees" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/registration", async (req, res) => {
    try {
        const employee = new Employee(req.body);
        let eemployee = await Employee.findOne({ email: employee.email });
        if (eemployee != null) {
            res.status(400).json({
                message: `Employee already exists with email: ${employee.email}`
            });
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(employee.password, saltRounds);
            employee.password = hashedPassword;
            const login = new Login({ email: employee.email, password: employee.password, role: "employee" });
            await login.save();
            await employee.save();
            res.status(201).json({ data: employee, message: "Employee created successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;