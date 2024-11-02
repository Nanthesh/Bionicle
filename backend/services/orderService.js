const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

const createOrderService = async (user_id, products) => {
  try {
    // Check if the user already has an order with status 'Pending'
    const existingOrder = await Order.findOne({ user_id, status: 'Pending' });
    if (existingOrder) {
      throw new Error(`User with ID ${user_id} already has an existing order with status 'Pending'.`);
    }

    // Check product availability and calculate total price
    let total_price = 0;
    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.product_id}. Available quantity: ${product.stock_quantity}`);
      }
      total_price += product.price * item.quantity;
    }

    // Create the new order
    const newOrder = new Order({
      user_id,
      products,
      total_price,
      status: 'Pending',
    });

    await newOrder.save();
    return newOrder;
  } catch (error) {
    throw new Error(error.message);
  }
};


const updateOrderStatusService = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId).populate('products.product_id');
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if the current status is already "Cancelled" or "Completed"
    if (order.status === 'Cancelled' || order.status === 'Completed') {
      throw new Error('Order cannot be updated because it is already in "Cancelled" or "Completed" status.');
    }

    // Check if status is changing to "Completed"
    if (status === 'Completed') {
      for (const item of order.products) {
        const product = await Product.findById(item.product_id);
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock to complete order for product ID ${item.product_id}`);
        }

        // Deduct the quantity from product stock
        product.stock_quantity -= item.quantity;
        await product.save();
      }
    }

    // Update the status
    order.status = status;
    await order.save();

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};


const getOrderByIdService = async (orderId) => {
  try {
    // Find the order by ID and populate product details
    const order = await Order.findById(orderId).populate('products.product_id');
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createOrderService, updateOrderStatusService,getOrderByIdService };
