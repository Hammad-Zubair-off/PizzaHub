const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { authenticate, isAdmin } = require('../middleware/authenticate');

const router = express.Router();
require('dotenv').config(); // Load env variables

// **User Registration**
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

        const user = new User({ name, email, password }); // Role defaults to "customer"
        await user.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// **User & Admin Login**
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) 
            return res.status(400).json({ success: false, message: "Email and password are required" });

        // **Admin Hardcoded Login (Hammad)**
        if (email === "hammad@gmail.com") {
            const hashedAdminPassword = await bcrypt.hash("123", 10); // Ensure it's hashed
            const isMatch = await bcrypt.compare(password, hashedAdminPassword);
            
            if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

            const token = jwt.sign({ email, role: "admin" }, process.env.SECRET_KEY, { expiresIn: "1h" });

            return res.json({
                success: true,
                token,
                user: { id: "admin", name: "Hammad", email, role: "admin" }
            });
        }

        // **Regular User Login**
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        // **Generate JWT Token**
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.json({ 
            success: true, 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// **Get Current User**
router.get('/me', authenticate, async (req, res) => {
    res.json({ success: true, user: req.user });
});

// **Get All Users (Admin Only)**
router.get('/users', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Hide passwords in response
        res.json({ success: true, users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
