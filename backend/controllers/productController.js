// controllers/productController.js
const {
    getAllProductsService,
    getProductByIdService,
    addProductService,
    updateProductService,
    deleteProductService,
} = require('../services/productService');
const redisClient = require('../database/redisClient');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductsService();

        // Cache the products data with a 1-hour expiration
        redisClient.set(res.locals.cacheKey, JSON.stringify(products), 'EX', 3600, (err, reply) => {
            if (err) {
                console.error('Redis Set Error:', err);
            } else {
                console.log('Data Cached at Key:', res.locals.cacheKey, 'Reply:', reply); // Should log "OK"
            }
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    const cacheKey = `product:${req.params.id}`; // Unique key for each product

    try {
        // Check if the product data is in the cache
        redisClient.get(cacheKey, async (err, cachedData) => {
            if (err) {
                console.error('Redis Get Error:', err);
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            if (cachedData) {
                console.log('Cache Hit:', cacheKey);
                return res.status(200).json(JSON.parse(cachedData)); // Send cached data if found
            }

            // If no cache, fetch from the database
            const product = await getProductByIdService(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found or out of stock' });
            }

            // Cache the product data for future requests
            redisClient.set(cacheKey, JSON.stringify(product), 'EX', 3600, (setErr, reply) => {
                if (setErr) {
                    console.error('Redis Set Error:', setErr);
                } else {
                    console.log('Data Cached at Key:', cacheKey, 'Reply:', reply); // Should log "OK"
                }
            });

            res.status(200).json(product);
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const addProduct = async (req, res) => {
    try {
        const newProduct = await addProductService(req.body);
        
        // Invalidate the cache for all products to ensure the new product is included
        await redisClient.del('products:/api/products/'); // Adjust the key as needed

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await updateProductService(req.params.id, req.body);
        
        // Invalidate both the product list and the individual product cache
        await redisClient.del('products:/api/products/'); // Invalidate all products
        console.log("all products cache deleted")
        await redisClient.del(`product:/api/products/${req.params.id}`); // Invalidate specific product

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const result = await deleteProductService(req.params.id);

        // Invalidate both the product list and the specific product cache
        await redisClient.del('products:/api/products/'); // Invalidate all products
        await redisClient.del(`product:/api/products/${req.params.id}`); // Invalidate specific product

        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllProducts, getProductById,addProduct,updateProduct,deleteProduct };
