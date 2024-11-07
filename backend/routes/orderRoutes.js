const express = require('express');
const router = express.Router();
const { createOrder, updateOrder,getOrderById,getOrdersByUserId,getCurrentOrder  } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const cacheMiddleware = require('../middlewares/cacheMiddleware'); 

// Create a new order
router.post('/', authMiddleware, createOrder);

// Update order status
router.put('/:orderId', authMiddleware, updateOrder);


// Retrieve order by id
router.get('/:orderId', authMiddleware, getOrderById );

// Retrieve all orders for a user
router.get('/user/orders', authMiddleware, cacheMiddleware('orders'), getOrdersByUserId);

// Retrieve the current order for a user
router.get('/user/current-order', authMiddleware, cacheMiddleware('current-order'), getCurrentOrder);


module.exports = router;
