// controllers/productController.js
const {
    getAllProductsService,
    getProductByIdService,
} = require('../services/productService');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductsService();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found or out of stock' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllProducts, getProductById };
