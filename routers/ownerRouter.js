// create router for owner model

const express = require("express");
const router = express.Router();
const Owner = require("../models/owner");
const bcrypt = require('bcrypt');


// get all owners
router.get("/list", async (req, res) => {
    try {
        const owners = await Owner.find().select("-password");        
        res.status(200).json({ data: owners, message: "List of owners" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// post a new owner
router.post("/registration", async (req, res) => {
    try {
        const owner = new Owner(req.body);
        console.log("owner body: " + owner);
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
            await owner.save();
            res.status(201).json({ data: owner, message: "Owner created successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;