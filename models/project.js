const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    clientName: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
