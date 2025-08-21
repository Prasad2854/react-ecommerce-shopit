const express = require('express');
const router = express.Router();
const Order = require('../models/Order.js');
const User = require('../models/User.js');
const auth = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const {
            orderItems, shippingAddress, paymentMethod,
            itemsPrice, taxPrice, shippingPrice, totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            // orderItems: orderItems.map(item => ({...item, product: item.id})),

            orderItems,
            user: req.user.id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        const user = await User.findById(req.user.id);
        if (user) {
            const emailSubject = `Your ShopIt Order Confirmation #${createdOrder._id}`;
            const emailHtml = `
                <h1>Thank you for your order!</h1>
                <p>Hi ${user.name},</p>
                <p>We've received your order and will process it shortly.</p>
                <h3>Order Summary</h3>
                <ul>
                    ${createdOrder.orderItems.map(item => `<li>${item.name} (x${item.qty}) - ₹${item.price.toFixed(2)}</li>`).join('')}
                </ul>
                <p><strong>Total: ₹${createdOrder.totalPrice.toFixed(2)}</strong></p>
            `;
            await sendEmail({ to: user.email, subject: emailSubject, html: emailHtml });
        }

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Make sure the logged-in user is the one who owns the order
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await order.deleteOne();
        res.json({ message: 'Order removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
