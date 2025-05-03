const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Access Denied: No token provided" 
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        if (decoded.role === 'admin' || decoded.isAdmin) {
            req.user = decoded;
            return next();
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "User not found" 
            });
        }

        req.user = { 
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(401).json({ 
            success: false,
            message: "Invalid or Expired Token" 
        });
    }
};

// Middleware to Check If User is Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.isAdmin)) {
        next();
    } else {
        return res.status(403).json({ 
            success: false,
            message: "Access Denied: Admins only" 
        });
    }
};