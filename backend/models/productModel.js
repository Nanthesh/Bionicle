const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock_quantity: {
        type: Number,
        required: 
        true,
    },
    modelNumber: {
        type: String,
        required: true,
    },
    voltage: {
        type: Number,
        required: true,
    },
    amp: {
        type: Number,
        required: true,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
