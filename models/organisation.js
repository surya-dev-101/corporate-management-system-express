const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({

    organizationId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    contact: {
        email: String,
        phone: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
    },
});

module.exports = mongoose.model('Organization', organizationSchema);
