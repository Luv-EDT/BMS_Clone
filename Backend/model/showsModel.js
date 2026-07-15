const mongoose = require("mongoose")

const showSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        theatre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Theatre",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        totalSeats: {
            type: Number,
            required: true,
        },
        ticketPrice: {
            type: Number,
            required: true,
        },
        availableSeats: {
            type: Number,
            required: true,
        },
        bookedSeats: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
)

const Show = mongoose.model("Show", showSchema)

module.exports = Show