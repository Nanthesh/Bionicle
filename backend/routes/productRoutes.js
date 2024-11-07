const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById,addProduct,updateProduct,deleteProduct} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const cacheMiddleware = require('../middlewares/cacheMiddleware');


// Get all products (protected route)
router.get('/', authMiddleware,cacheMiddleware('products'),  getAllProducts);

// Get a single product by ID (protected route)
router.get('/:id', authMiddleware, cacheMiddleware('products'), getProductById);

router.post('/', authMiddleware, addProduct);

router.put('/:id', authMiddleware, updateProduct); 

router.delete('/:id', authMiddleware, deleteProduct);


module.exports = router;
