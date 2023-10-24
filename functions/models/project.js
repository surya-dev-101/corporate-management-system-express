const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // projectId: {
    //     type: String,
    //     unique: true,
    // },
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

// projectSchema.pre("save", async function (next) {
//     if (!this.projectId) {
//         const currentYear = new Date().getFullYear().toString();
//         const lastPro = await this.constructor.findOne(
//             { projectId: new RegExp(`^PRO${currentYear}\\d{3}$`) },
//             { projectId: 1 },
//             { sort: { createdAt: -1 } }
//         );

//         if (lastPro) {
//             const lastNumber = parseInt(lastPro.projectId.slice(-3));
//             this.projectId = `PRO${currentYear}${(lastNumber + 1)
//                 .toString()
//                 .padStart(3, "0")}`;
//         } else {
//             this.projectId = `PRO${currentYear}001`;
//         }
//     }
//     next();
// });

module.exports = mongoose.model('Project', projectSchema);
