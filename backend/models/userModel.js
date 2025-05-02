const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }, // Role-based authentication
    cartItems: [{
        pizza: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pizza',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        size: {
            type: String,
            required: true,
            enum: ['small', 'medium', 'large']
        },
        price: {
            type: Number,
            required: false
        }
    }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, process.env.SECRET_KEY, { expiresIn: '7d' });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
