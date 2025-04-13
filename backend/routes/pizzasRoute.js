const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizzaModel');
const { authenticate, isAdmin } = require('../middleware/authenticate');

// **Get All Pizzas (Public)**
router.get("/getallpizzas", async (req, res) => {
    try {
        const pizzas = await Pizza.find({});
        res.json(pizzas);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});
router.post('/addpizza', authenticate, async (req, res) => {
    try {
        const { name, varients, prices, category, image, description } = req.body;
        if (!name || !varients || !prices || !category || !image || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const pizza = new Pizza({ name, varients, prices, category, image, description });
        const savedPizza = await pizza.save();
        console.log(savedPizza);
        res.json(savedPizza);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.put('/editpizza/:id', authenticate, async (req, res) => {
    try {
        const { name, image, description, prices, category, varients } = req.body;

        // ✅ Find existing pizza
        let pizza = await Pizza.findById(req.params.id);
        if (!pizza) {
            return res.status(404).json({ message: "Pizza not found" });
        }

        // ✅ Update pizza details
        pizza.name = name || pizza.name;
        pizza.image = image || pizza.image;
        pizza.description = description || pizza.description;
        pizza.prices = prices?.length > 0 ? prices : pizza.prices;
        pizza.category = category || pizza.category;
        pizza.varients = varients || pizza.varients;

        await pizza.save();
        res.json({ message: "Pizza updated successfully", pizza });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


router.delete('/deletepizza/:id', authenticate ,async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized! Token is required" });
        }

        

        const pizza = await Pizza.findById(req.params.id);

        if (!pizza) {
            return res.status(404).json({ message: "Pizza not found" });
        }

        await pizza.deleteOne();
        res.json({ message: "Pizza deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


module.exports = router;
