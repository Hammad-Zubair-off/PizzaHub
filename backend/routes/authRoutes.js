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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword }); // Role defaults to "customer"
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// **User & Admin Login**
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt with email:", email);
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        // Admin Login Check
        if (email === process.env.ADMIN_EMAIL) {
            if (password === process.env.ADMIN_PASSWORD) {
                console.log("Admin login successful");
                const token = jwt.sign(
                    { 
                        role: 'admin',
                        email,
                        isAdmin: true
                    },
                    process.env.SECRET_KEY || 'userRoutesafe',
                    { expiresIn: "24h" }
                );
                return res.json({
                    success: true,
                    token,
                    user: {
                        role: 'admin',
                        email,
                        isAdmin: true,
                        name: 'Admin'
                    }
                });
            } else {
                console.log("Admin login failed - invalid password");
                return res.status(401).json({ 
                    success: false, 
                    message: "Invalid admin credentials" 
                });
            }
        }

        // Regular User Login
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // const validPassword = await bcrypt.compare("zxcvbnm", user.password);
        // console.log("Password match:", validPassword);
        // if (!validPassword) {
        //     return res.status(400).json({ 
        //         success: false, 
        //         message: "Invalid pass credentials" 
        //     });
        // }

        // Generate JWT Token for regular user
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.role 
            },
            process.env.SECRET_KEY || 'userRoutesafe',
            { expiresIn: "24h" }
        );

        return res.json({ 
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
