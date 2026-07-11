const express = require("express")
const Show = require("../model/showsModel")
const Theatre = require("../model/theatreModel")
const authMiddleware = require("../middlewares/authMiddleware")
const profileAuthMiddleware = require("../middlewares/profileAuthMiddleware")

const router = express.Router()


// ========================
// Get All Shows (public)
// ========================

router.get("/getAll", async (req, res) => {
    try {
        const shows = await Show.find()
            .populate("movie")
            .populate("theatre")
            .populate("user", "-password")
            .sort({ date: 1 })

        return res.status(200).json({
            success: true,
            message: "Shows fetched successfully",
            data: shows,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch shows",
            error: error.message,
        })
    }
})


// ========================
// Get Shows for logged in
// user's theatres (profile)
// ========================

router.get("/getUserShows", authMiddleware, profileAuthMiddleware, async (req, res) => {
    try {
        // first find all theatres owned by this user
        const userTheatres = await Theatre.find({
            owner: req.user._id
        })

        const theatreIds = userTheatres.map((t) => t._id)
        
        // console.log(theatreIds)

        // then find all shows belonging to those theatres
        const shows = await Show.find({
            theatre: { $in: theatreIds }
        })
            .populate("movie")
            .populate("theatre")
            .populate("user", "-password")
            .sort({ date: 1 })

        return res.status(200).json({
            success: true,
            message: "User shows fetched successfully",
            data: shows,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user shows",
            error: error.message,
        })
    }
})


// ========================
// Add Show
// ========================

router.post("/add", authMiddleware, profileAuthMiddleware, async (req, res) => {
    try {
        const { name, movie, theatre, date, totalSeats } = req.body

        const newShow = await Show.create({
            name,
            movie,
            theatre,
            user: req.user._id,
            date,
            totalSeats,
            availableSeats: totalSeats,
            bookedSeats: 0,
        })

        // populate after creation so frontend gets full objects
        const populatedShow = await Show.findById(newShow._id)
            .populate("movie")
            .populate("theatre")
            .populate("user", "-password")

        return res.status(201).json({
            success: true,
            message: "Show added successfully",
            data: populatedShow,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add show",
            error: error.message,
        })
    }
})


// ========================
// Update Show
// ========================

router.put("/update/:id", authMiddleware, async (req, res) => {
    try {

        
        const { id } = req.params

        const updatedShow = await Show.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        ).populate("movie").populate("theatre").populate("user", "-password")

        if (!updatedShow) {
            return res.status(404).json({
                success: false,
                message: "Show not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Show updated successfully",
            data: updatedShow,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update show",
            error: error.message,
        })
    }
})


// ========================
// Delete Show
// ========================

router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const deletedShow = await Show.findByIdAndDelete(id)

        if (!deletedShow) {
            return res.status(404).json({
                success: false,
                message: "Show not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Show deleted successfully",
            data: deletedShow,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete show",
            error: error.message,
        })
    }
})


module.exports = router