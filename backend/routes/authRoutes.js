const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { authenticate, isAdmin } = require('../middleware/authenticate');

const router = express.Router();
require('dotenv').config(); // Load env variables

// **Admin Login**
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        // Admin credentials check
        if (email !== "admin@pizzahub.com" || password !== "admin") {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid admin credentials" 
            });
        }

        // Generate admin token
        const token = jwt.sign(
            { 
                role: 'admin',
                email,
                isAdmin: true
            },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            token,
            user: {
                role: 'admin',
                email,
                isAdmin: true,
                name: 'Admin'
            }
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
});

// **User Registration**
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email already exists" 
            });
        }

        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ 
            name, 
            email, 
            password: password,
            role: "customer" 
        });
        await user.save();

        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.role 
            },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
});

// **User Login**
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, "neechey");
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        // Regular User Login
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
       console.log("neechey");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
     console.log("neechey2");
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.role 
            },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
});

// **Token Validation Route**
router.get('/validate', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Token validation error:', err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// **Logout Route**
router.post('/logout', authenticate, (req, res) => {
    res.json({
        success: true,
        message: "Logged out successfully"
    });
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
