const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
const profileAuthMiddleware = require("../middlewares/profileAuthMiddleware");

const router = express.Router();


// ========================
// Register
// ========================

router.post("/register", async (req, res) => {

    const { name, userId, password } = req.body;

    try {

        // Check if user already exists
        const existingUser = await User.findOne({ userId });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        // Validate Password
        const passwordRegex = /^(?=.*[0-9]).{6,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters and one number."
            });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User

        const newUser = await User.create({
            name,
            userId,
            password: hashedPassword
        });

        
        const jwtToken = jwt.sign(
            {
                userId: newUser._id
            },
            process.env.AUTH_KEY,
            {
                expiresIn: "7d"
            }
        );


        return res.status(201).json({
            success: true,
            message: "Registered Successfully",
            token: jwtToken

        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Registration Failed",
            error: error.message
        });

    }

});


// ========================
// Login
// ========================

router.post("/login", async (req, res) => {

    const { userId, password } = req.body;

    try {

        // Check User

        const user = await User.findOne({ userId });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // Compare Password

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        // Create JWT

        const jwtToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.AUTH_KEY,
            {
                expiresIn: "7d"
            }
        );

        console.log("User Logged In");

        return res.status(200).json({

            success: true,
            message: "Logged In Successfully",
            token: jwtToken

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            error

        });

    }

});


// ========================
// Get Current User
// ========================

router.get(
    "/getCurrentUser",
    authMiddleware,
    async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                message: "User information fetched successfully.",
                userData: req.user
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                error
            });

        }

    }
);

router.get(
    "/getCurrentAdmin",
    authMiddleware,
    adminAuthMiddleware,
    async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                message: "User information fetched successfully.",
                userData: req.user
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                error
            });

        }

    }
);


router.get(
    "/getCurrentProfile",
    authMiddleware,
    profileAuthMiddleware,
    async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                message: "User information fetched successfully.",
                userData: req.user
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                error
            });

        }

    }
);


module.exports = router;