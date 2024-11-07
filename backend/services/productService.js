// services/productService.js
const Product = require('../models/productModel');

// Service to get all products with stock greater than 0
const getAllProductsService = async () => {
    return await Product.find({ stock_quantity: { $gt: 0 } });
};

// Service to get a product by ID with stock greater than 0
const getProductByIdService = async (id) => {
    return await Product.findOne({ _id: id, stock_quantity: { $gt: 0 } });
};

const addProductService = async (productData) => {
    const newProduct = new Product(productData);
    return await newProduct.save();
};

const updateProductService = async (id, updateData) => {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteProductService = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    getAllProductsService,
    getProductByIdService,
    addProductService,
    updateProductService,
    deleteProductService,
};
