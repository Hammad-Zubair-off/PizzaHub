const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");
const User = require("../models/userModel");
const Pizza = require("../models/pizzaModel");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cartItems.pizza");
    res.json({ success: true, cartItems: user.cartItems });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Add item to cart
router.post("/add", authenticate, async (req, res) => {
  try {
    const { pizzaId, quantity, size } = req.body;

    if (!pizzaId || !quantity || !size) {
      return res.status(400).json({
        success: false,
        message: "Please provide pizzaId, quantity, and size",
      });
    }

    const pizza = await Pizza.findById(pizzaId);
    console.log(pizza, "pizza");
    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    let price;
    switch (size) {
      case "small":
        price = pizza.prices[0].price;
        break;
      case "medium":
        price = pizza.prices[1].price;
        break;
      case "large":
        price = pizza.prices[2].price;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid size",
        });
    }

    const user = await User.findById(req.user.id);
    const existingItemIndex = user.cartItems.findIndex(
      (item) => item.pizza.toString() === pizzaId && item.size === size
    );

    if (existingItemIndex >= 0) {
      user.cartItems[existingItemIndex].quantity += quantity;
    } else {
      user.cartItems.push({
        pizza: pizzaId,
        quantity,
        size,
        price,
      });
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id).populate(
      "cartItems.pizza"
    );

    res.json({
      success: true,
      message: "Item added to cart",
      cartItems: updatedUser.cartItems,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Remove item from cart
router.delete("/remove/:itemId", authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user.id);

    user.cartItems = user.cartItems.filter(
      (item) => item._id.toString() !== itemId
    );
    await user.save();

    const updatedUser = await User.findById(req.user.id).populate(
      "cartItems.pizza"
    );
    res.json({
      success: true,
      message: "Item removed from cart",
      cartItems: updatedUser.cartItems,
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.put("/update/:itemId", authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const user = await User.findById(req.user.id);
    const itemIndex = user.cartItems.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    user.cartItems[itemIndex].quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(req.user.id).populate(
      "cartItems.pizza"
    );
    res.json({
      success: true,
      message: "Cart updated",
      cartItems: updatedUser.cartItems,
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.delete("/clear", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cartItems = [];
    await user.save();

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
