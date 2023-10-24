const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({

    // organizationId: {
    //     type: String,
    //     unique: true,
    // },
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
        ref: 'Owner'
    },
});

// organizationSchema.pre("save", async function (next) {
//     if (!this.organizationId) {
//         const currentYear = new Date().getFullYear().toString();
//         const lastOrg = await this.constructor.findOne(
//             { organizationId: new RegExp(`^ORG${currentYear}\\d{3}$`) },
//             { organizationId: 1 },
//             { sort: { createdAt: -1 } }
//         );

//         if (lastOrg) {
//             const lastNumber = parseInt(lastOrg.organizationId.slice(-3));
//             this.organizationId = `ORG${currentYear}${(lastNumber + 1)
//                 .toString()
//                 .padStart(3, "0")}`;
//         } else {
//             this.organizationId = `ORG${currentYear}001`;
//         }
//     }
//     next();
// });

module.exports = mongoose.model('Organization', organizationSchema);
