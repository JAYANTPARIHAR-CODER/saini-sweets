const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        default: "PICKUP"
    },
    deliveryType: {
        type: String,
        default: "Delivery"  // Delivery or Pickup
    },
    notes: {
        type: String,
        default: ""
    },
    items: [
        {
            product: String,   // product name
            quantity: Number,  // how many
            price: String      // price string like ₹12/pc
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "pending"  // pending → confirmed → delivered
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;