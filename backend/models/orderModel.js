const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    total_price: {
        type: Number,
        required: true,
    },
    order_date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    shipping_address: {
        address: { type: String, required: true }, // e.g., "123 Main St"
        city: { type: String, required: true },    // e.g., "Toronto"
        state: { type: String, required: true },   // e.g., "Ontario"
        zipCode: { type: String, required: true }, // e.g., "M1B 2K1"
        country: { type: String, required: true }, // e.g., "Canada"
      },
});

module.exports = mongoose.model('Order', orderSchema);
