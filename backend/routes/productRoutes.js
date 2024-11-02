const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); 


// Get all products (protected route)
router.get('/', authMiddleware, getAllProducts);

// Get a single product by ID (protected route)
router.get('/:id', authMiddleware, getProductById);

module.exports = router;
