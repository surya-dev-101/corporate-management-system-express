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
    role: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
})

module.exports = mongoose.model('Employee', employeeSchema)