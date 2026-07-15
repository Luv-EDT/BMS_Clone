const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
    {
        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Show",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seats: {
            type: [String],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        },
          sessionId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking