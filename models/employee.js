const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    isOnBench: {
        type: Boolean,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    joinedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
    ],
})

module.exports = mongoose.model('Employee', employeeSchema)