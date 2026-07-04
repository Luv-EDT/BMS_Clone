const express = require("express")
const Movie = require("../model/moviesModel")
const authMiddleware = require("../middlewares/authMiddleware")
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware")

const router = express.Router()


// ========================
// Get All Movies
// ========================

router.get("/getAll", async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: "Movies fetched successfully",
            data: movies,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch movies",
            error: error.message,
        })
    }
})


// ========================
// Add Movie
// ========================

router.post("/add", authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const { name, poster, genre, description, duration, languages, releaseDate } = req.body

        const newMovie = await Movie.create({
            name,
            poster,
            genre,
            description,
            duration,
            languages,
            releaseDate,
        })

        return res.status(201).json({
            success: true,
            message: "Movie added successfully",
            data: newMovie,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add movie",
            error: error.message,
        })
    }
})


// ========================
// Update Movie
// ========================

router.put("/update/:id", authMiddleware,adminAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }  // returns the updated document, not the old one
        )

        if (!updatedMovie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            data: updatedMovie,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update movie",
            error: error.message,
        })
    }
})


// ========================
// Delete Movie
// ========================

router.delete("/delete/:id", authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const deletedMovie = await Movie.findByIdAndDelete(id)

        if (!deletedMovie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
            data: deletedMovie,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete movie",
            error: error.message,
        })
    }
})


module.exports = router