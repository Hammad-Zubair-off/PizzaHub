const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const dotenv = require('dotenv');
const Order = require('../models/orderModel');
const { authenticate } = require('../middleware/authenticate');
dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    // Log the secret key for debugging (remove in production)
    console.log('Using Stripe secret key:', process.env.STRIPE_SECRET_KEY);
    
    const { cartItems, shippingAddress } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'No cart items provided' });
    }

    // Format line items for Stripe
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'pkr', // Using PKR (Pakistani Rupee) as currency
        product_data: {
          name: item.name,
          images: [item.image], // Add product image
          description: `Size: ${item.variant}`,
        },
        unit_amount: Math.round(item.price * 100), // Convert to smallest currency unit (paise)
      },
      quantity: item.quantity,
    }));

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/cart`,
      shipping_address_collection: {
        allowed_countries: ['PK'], // Only allow Pakistan
      },
      metadata: {
        order_id: Date.now().toString(), // Add a simple order ID
      },
    });

    // Create order in database without user ID
    const order = new Order({
      // user field is required in the model, so we'll use a placeholder
      user: '000000000000000000000000', // MongoDB ObjectId placeholder
      items: cartItems.map(item => ({
        pizza: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    res.json({ 
      id: session.id,
      orderId: order._id 
    });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: error.message || 'Stripe session creation failed' });
  }
});

// Webhook to handle successful payments
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Update order status
      const order = await Order.findOneAndUpdate(
        { _id: session.metadata.order_id },
        { 
          status: 'confirmed',
          paymentStatus: 'completed'
        },
        { new: true }
      );

      if (!order) {
        console.error('Order not found:', session.metadata.order_id);
        return res.status(404).json({ error: 'Order not found' });
      }

      console.log('Order confirmed:', order._id);
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ error: 'Error updating order' });
    }
  }

  res.json({ received: true });
});

module.exports = router; 