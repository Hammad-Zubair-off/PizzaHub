const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authenticate = async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];  // ✅ Read token from headers
      console.log(token);
      if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });
        const decoded = jwt.verify(token, "userRoutesafe");  // ✅ Match same secret key
      req.user = decoded; // ✅ Save decoded user info in request
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or Expired Token" });
    }
  };

// Middleware to Check If User is Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access Denied: Admins only" });
    }
};