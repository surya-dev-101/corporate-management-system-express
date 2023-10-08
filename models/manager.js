const mongoose = require('mongoose')

const managerSchema = new mongoose.Schema({
    managerId: {
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
    designation: {
        type: String,
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

managerSchema.pre("save", async function (next) {
    if (!this.managerId) {
        const currentYear = new Date().getFullYear().toString();
        const lastMngr = await this.constructor.findOne(
            { managerId: new RegExp(`^MGR${currentYear}\\d{3}$`) },
            { managerId: 1 },
            { sort: { createdAt: -1 } }
        );

        if (lastMngr) {
            const lastNumber = parseInt(lastMngr.managerId.slice(-3));
            this.managerId = `MGR${currentYear}${(lastNumber + 1)
                .toString()
                .padStart(3, "0")}`;
        } else {
            this.managerId = `MGR${currentYear}001`;
        }
    }
    next();
});

module.exports = mongoose.model('Manager', managerSchema)