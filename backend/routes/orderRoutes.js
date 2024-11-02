const express = require('express');
const router = express.Router();
const { createOrder, updateOrderStatus,getOrderById  } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Create a new order
router.post('/', authMiddleware, createOrder);

// Update order status
router.put('/:orderId', authMiddleware, updateOrderStatus);


// Retrieve order by id
router.get('/:orderId', authMiddleware, getOrderById );

module.exports = router;
