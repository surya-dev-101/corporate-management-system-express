const mongoose = require('mongoose')

const ownerSchema = new mongoose.Schema({
    ownerId: {
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
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
})

module.exports = mongoose.model('Owner', ownerSchema)