const mongoose = require("mongoose")

const theatreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false, // pending by default until admin approves
        },
    },
    {
        timestamps: true,
    }
)

const Theatre = mongoose.model("Theatre", theatreSchema)

module.exports = Theatre