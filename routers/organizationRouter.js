const express = require("express");
const router = express.Router();
const Organization = require("../models/organization");

// get all owners
router.get("/list", async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json({ data: organizations, message: "List of organizations" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// post a new owner
router.post("/registration", async (req, res) => {
    try {
        const org = new Organization(req.body);
        let eorg = await Organization.findOne({ name: org.name });
        console.log("eorg: " + eorg);
        if (eorg != null) {
            res.status(400).json({
                message: `Organization already exists with name: ${org.name}`
            });
        } else {
            await org.save();
            res.status(201).json({ data: org, message: "Organization created successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;