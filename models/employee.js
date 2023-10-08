const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    employeeId: {
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

employeeSchema.pre("save", async function (next) {
    if (!this.employeeId) {
        const currentYear = new Date().getFullYear().toString();
        const lastEmp = await this.constructor.findOne(
            { employeeId: new RegExp(`^EMP${currentYear}\\d{3}$`) },
            { employeeId: 1 },
            { sort: { createdAt: -1 } }
        );

        if (lastEmp) {
            const lastNumber = parseInt(lastEmp.employeeId.slice(-3));
            this.employeeId = `EMP${currentYear}${(lastNumber + 1)
                .toString()
                .padStart(3, "0")}`;
        } else {
            this.employeeId = `EMP${currentYear}001`;
        }
    }
    next();
});

module.exports = mongoose.model('Employee', employeeSchema)