const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        poster: {
            type: String,
            required: true,
        },
        genre: {
            type: [String],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        languages: {
            type: [String],
            required: true,
        },
        releaseDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Movie = mongoose.model("Movie", movieSchema)

module.exports = Movie