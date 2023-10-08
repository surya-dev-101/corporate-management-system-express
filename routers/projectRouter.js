const express = require("express");
const router = express.Router();
const Project = require("../models/project");

// get all owners
router.get("/list", async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ data: projects, message: "List of projects" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// post a new owner
router.post("/registration", async (req, res) => {
    try {
        const project = new Project(req.body);
        let eproject = await Project.findOne({ name: project.name });

        if (eproject != null) {
            res.status(400).json({
                message: `Project already exists with name: ${project.name}`
            });
        } else {
            await project.save();
            res.status(201).json({ data: project, message: "Project created successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;