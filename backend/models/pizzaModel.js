const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    varients: {
        type: [String],
        required: true
    },
    prices: [{
        varient: String,
        price: Number
    }],
    category: {
        type: String,
        required: true,
        enum: ['Veg', 'Non-Veg']
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    popularity: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    tags: {
        type: [String],
        default: []
    },
    ingredients: {
        type: [String],
        required: true
    },
    cookingTime: {
        type: Number,
        required: true
    },
    spiceLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

const Pizza = mongoose.model('Pizza', pizzaSchema);
module.exports = Pizza;
