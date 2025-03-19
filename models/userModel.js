const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }, // Role-based authentication
}, { timestamps: true });

// **Hash password before saving**
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// **JWT Token Generation**
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
