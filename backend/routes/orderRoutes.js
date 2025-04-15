const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const Order = require('../models/orderModel');

// Create a new order
router.post('/', authenticate, async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress
        });
        
        const savedOrder = await order.save();
        res.status(201).json({
            success: true,
            order: savedOrder
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
});

// Get user's orders
router.get('/myorders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

// Get all orders (admin only)
router.get('/all', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Admin only'
        });
    }
    
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Fetch all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching all orders'
        });
    }
});

// Update order status (admin only)
router.put('/:orderId/status', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Admin only'
        });
    }

    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status'
        });
    }
});

module.exports = router; 