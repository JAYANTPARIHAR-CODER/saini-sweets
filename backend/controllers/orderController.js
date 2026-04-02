const Order = require('../models/Order');

// GET all orders → /api/orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET one order by ID → /api/orders/1
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create new order → /api/orders
const createOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, items, totalAmount } = req.body;

        if (!customerName || !customerPhone || !items || !totalAmount) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const order = await Order.create({
            customerName,
            customerPhone,
            items,
            totalAmount
        });

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT update order status → /api/orders/1
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }  // return the updated order
        );
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };