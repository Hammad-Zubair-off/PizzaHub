const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt=require("bcrypt");
const cors = require('cors');
const jwt=require('jsonwebtoken')
require('dotenv').config();

const connectWithDB = require('./db');
const app = express();
connectWithDB();

app.use(express.json()); // Parse JSON
app.use(cors()); // Enable CORS

// Routes
const pizzasRoute = require('./routes/pizzasRoute');
const authRoutes = require('./routes/authRoutes');

app.use("/api/pizzas", pizzasRoute);
app.use("/api/auth", authRoutes);

const ADMIN_CREDENTIALS = {
    username: 'hammad@gmail.com',
    password: bcrypt.hashSync('123', 10), // Encrypting password
  };

  //Admin Login Route
  app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    if (username !== ADMIN_CREDENTIALS.username) {
      return res.status(401).json({ success: false, message: 'Invalid username' });
    }

    const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ username }, "userRoutesafe", { expiresIn: '1h' });

    res.json({ success: true, token });  // ✅ Only send token in response
});

// Serve React Frontend in Production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client", "build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Pizza API is running 🚀");
    });
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));