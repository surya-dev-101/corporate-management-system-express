const mongoose = require('mongoose')

const ownerSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        unique: true
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

ownerSchema.pre("save", async function (next) {
    if (!this.ownerId) {
        const currentYear = new Date().getFullYear().toString();
        const lastOwner = await this.constructor.findOne(
            { ownerId: new RegExp(`^OWN${currentYear}\\d{3}$`) },
            { ownerId: 1 },
            { sort: { createdAt: -1 } }
        );

        if (lastOwner) {
            const lastNumber = parseInt(lastOwner.ownerId.slice(-3));
            this.ownerId = `OWN${currentYear}${(lastNumber + 1)
                .toString()
                .padStart(3, "0")}`;
        } else {
            this.ownerId = `OWN${currentYear}001`;
        }
    }
    next();
});

module.exports = mongoose.model('Owner', ownerSchema)