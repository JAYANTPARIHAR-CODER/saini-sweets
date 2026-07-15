const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// POST /api/payment/create-order
// Frontend calls this BEFORE opening the Razorpay checkout popup
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in rupees, e.g. 450

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Valid amount is required" });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay wants amount in paise (₹1 = 100 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,   // e.g. "order_XXXXXXXXXXXX"
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID, // safe to send — this is the PUBLIC key
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

        // Recreate the signature ourselves using our secret key
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, error: "Payment verification failed" });
        }

        // Signature matches → payment is real. NOW save the order to MongoDB.
        const order = await Order.create({
            ...orderData,
            status: "confirmed",          // skip "pending" since it's already paid
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
        });

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createRazorpayOrder, verifyPayment };