const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        varients: { type: [String], required: true }, // Example: ["small", "medium", "large"]
        prices: {
            type: [
                {
                    varient: { type: String, required: true }, // Matches a value in varients
                    price: { type: Number, required: true }
                }
            ],
            required: true
        },
        category: { type: String, required: true }, // Example: "Veg", "Non-Veg"
        image: { type: String, required: true },
        description: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
        rating: { type: Number, default: 0 } // Future use for customer reviews
    },
    {
        timestamps: true
    }
);

const Pizza = mongoose.model('Pizza', pizzaSchema);
module.exports = Pizza;
