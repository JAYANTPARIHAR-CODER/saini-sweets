const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');

// Clean routes — just doors that call controllers
router.post('/',         createOrder);        // POST   /api/orders  → place new order
router.get('/',          getOrders);          // GET    /api/orders  → see all orders (admin)
router.get('/:id',       getOrderById);       // GET    /api/orders/1 → one order
router.put('/:id',       updateOrderStatus);  // PUT    /api/orders/1 → update status

module.exports = router;