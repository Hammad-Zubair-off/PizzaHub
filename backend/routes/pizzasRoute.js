const express = require("express");
const router = express.Router();
const Pizza = require("../models/pizzaModel");
const { authenticate, isAdmin } = require("../middleware/authenticate");

router.get("/", async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};

    function capitalizeWords(str) {
      return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('-');
    }
    if (category && category !== "all") {
      query.category = capitalizeWords(category);
    }
    console.log("Query String in PizzasROute",query);

    let sortOptions = {};
    if (sort === "popular") {
      sortOptions.popularity = -1;
    } else if (sort === "rating") {
      sortOptions.rating = -1;
    }

    const pizzas = await Pizza.find(query).sort(sortOptions);
    console.log(`Found ${pizzas.length} pizzas`);
    res.json(pizzas);
  } catch (error) {
    console.error("Error in GET /api/pizzas:", error);
    res.status(500).json({
      message: "Error fetching pizzas",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    res.json(pizza);
  } catch (error) {
    console.error("Error in GET /api/pizzas/:id:", error);
    res.status(500).json({
      message: "Error fetching pizza",
      error: error.message,
    });
  }
});

router.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const {
      name,
      varients,
      prices,
      category,
      image,
      description,
      ingredients,
      cookingTime,
      spiceLevel,
    } = req.body;

    if (
      !name ||
      !varients ||
      !prices ||
      !category ||
      !image ||
      !description ||
      !ingredients ||
      !cookingTime ||
      !spiceLevel
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: [
          "name",
          "varients",
          "prices",
          "category",
          "image",
          "description",
          "ingredients",
          "cookingTime",
          "spiceLevel",
        ],
      });
    }
    const pizza = new Pizza({
      name,
      varients,
      prices,
      category,
      image,
      description,
      ingredients,
      cookingTime,
      spiceLevel,
      rating: req.body.rating || 4.0,
      popularity: req.body.popularity || 80,
      tags: req.body.tags || [],
      isAvailable:
        req.body.isAvailable !== undefined ? req.body.isAvailable : true,
    });

    const savedPizza = await pizza.save();

    res.status(201).json(savedPizza);
  } catch (error) {
    console.error("Error in POST /api/pizzas:", error);
    res.status(400).json({
      message: "Error adding pizza",
      error: error.message,
    });
  }
});

router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    const updatedPizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedPizza);
  } catch (error) {
    console.error("Error in PUT /api/pizzas/:id:", error);
    res.status(400).json({
      message: "Error updating pizza",
      error: error.message,
    });
  }
});

router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    await Pizza.findByIdAndDelete(req.params.id);

    res.json({ message: "Pizza deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/pizzas/:id:", error);
    res.status(400).json({
      message: "Error deleting pizza",
      error: error.message,
    });
  }
});

router.post("/bulk", authenticate, isAdmin, async (req, res) => {
  try {
    // Validate request body
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res
        .status(400)
        .json({ message: "Request body must be a non-empty array of pizzas" });
    }

    // Insert multiple pizzas
    const pizzas = await Pizza.insertMany(req.body);

    res.status(201).json(pizzas);
  } catch (error) {
    console.error("Error in POST /api/pizzas/bulk:", error);
    res.status(400).json({
      message: "Error adding pizzas",
      error: error.message,
    });
  }
});

module.exports = router;
