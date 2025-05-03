const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const dotenv = require("dotenv");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");
dotenv.config();

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Stripe secret key is not set in environment variables");
  throw new Error("Stripe secret key is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, shippingAddress } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "No cart items provided" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    let userId = "000000000000000000000000"; 

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.id) {
          userId = decoded.id;
        }
      } catch (err) {
        console.error("Token verification error:", err);
      }
    }

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "pkr", 
        product_data: {
          name: item.name,
          ...(item.image && item.image.length < 2048
            ? { images: [item.image] }
            : {}),
          description: `Size: ${item.variant}`,
        },
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }));
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = new Order({
      user: userId,
      items: cartItems.map((item) => ({
        pizza: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/cart`,
      shipping_address_collection: {
        allowed_countries: ["PK"], 
      },
      metadata: {
        order_id: order._id.toString(),
        user_id: userId,
      },
    });

    res.json({
      id: session.id,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Stripe session error:", error);
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to create checkout session";
    res.status(500).json({ error: errorMessage });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        console.log("Updating order:", session.metadata.order_id);

        const order = await Order.findByIdAndUpdate(
          session.metadata.order_id,
          {
            status: "confirmed",
            paymentStatus: "completed",
            paymentDetails: {
              paymentId: session.payment_intent,
              paymentMethod: "stripe",
              paidAt: new Date(),
            },
          },
          { new: true }
        );

        if (!order) {
          console.error("Order not found:", session.metadata.order_id);
          return res.status(404).json({ error: "Order not found" });
        }
      } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ error: "Error updating order" });
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
