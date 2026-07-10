const express = require("express")
const Theatre = require("../model/theatreModel")
const authMiddleware = require("../middlewares/authMiddleware")
const profileAuthMiddleware = require("../middlewares/profileAuthMiddleware")
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware")

const router = express.Router()


// ========================
// Get All Theatres
// ========================

router.get("/getAll", authMiddleware, async (req, res) => {
    try {
        const theatres = await Theatre.find({ owner: req.user._id })  // ← filter by logged in user
            .populate("owner", "-password")                            // ← exclude password
            .sort({ createdAt: -1 })
        
            return res.status(200).json({
            success: true,
            message: "Theatres fetched successfully",
            data: theatres,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch theatres",
            error: error.message,
        })
    }
})


// ========================
// Add Theatre
// ========================

router.post("/add", authMiddleware, profileAuthMiddleware, async (req, res) => {
    try {
        const { name, address, phone, email } = req.body

        const newTheatre = await Theatre.create({
            name,
            address,
            phone,
            email,
            owner: req.user._id,    // taken from auth middleware, not from req.body
            isActive: false,        // always starts as pending
        })

        return res.status(201).json({
            success: true,
            message: "Theatre added successfully",
            data: newTheatre,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add theatre",
            error: error.message,
        })
    }
})


// ========================
// Update Theatre
// ========================

router.put("/update/:id", authMiddleware, profileAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const updatedTheatre = await Theatre.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        ).populate("owner")

        if (!updatedTheatre) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Theatre updated successfully",
            data: updatedTheatre,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update theatre",
            error: error.message,
        })
    }
})


// ========================
// Delete Theatre
// ========================

router.delete("/delete/:id", authMiddleware, profileAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const deletedTheatre = await Theatre.findByIdAndDelete(id)

        if (!deletedTheatre) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Theatre deleted successfully",
            data: deletedTheatre,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete theatre",
            error: error.message,
        })
    }
})


router.put("/updateForAdmin/:id", authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const updatedTheatre = await Theatre.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        ).populate("owner")

        if (!updatedTheatre) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Theatre updated successfully",
            data: updatedTheatre,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update theatre",
            error: error.message,
        })
    }
})




router.get("/getAllForAdmin", authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const theatres = await Theatre.find()  // ← filter by logged in user
            .populate("owner", "-password")                            // ← exclude password
            .sort({ createdAt: -1 })
        
            return res.status(200).json({
            success: true,
            message: "All Theatres fetched successfully",
            data: theatres,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch theatres",
            error: error.message,
        })
    }
})


module.exports = router