const express = require('express');
const User = require("../model/userModel.js");
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { userId, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userId)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password (min 6 chars, at least one number)
        const passwordRegex = /^(?=.*[0-9]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 6 characters and contain a number' });
        }

        // Create user
        await User.create({ userId, password });
        console.log("New User Registered");
        res.status(201).json({ message: 'Registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { userId, password } = req.body;

    try {
        // Step 1: Check if user exists
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Check if password is correct
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Step 3: Logged in
        console.log("User logged in:", userId);
        res.status(200).json({ message: 'Logged in successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

module.exports = router;