const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { sendEmail } = require('../services/emailService');

const createOrderService = async (user_id, products,shipping_address ) => {
  try {
    console.log('Shipping address received in service:', shipping_address);

    if (!shipping_address) {
      throw new Error('Shipping address is undefined.');
    }
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
    const { address, city, state, zipCode, country } = shipping_address;
    // Create the new order
    const newOrder = new Order({
      user_id,
      products,
      total_price,
      status: 'Pending',
      shipping_address: {
        address,
        city,
        state,
        zipCode,
        country,
      },
    });

    await newOrder.save();
    return newOrder;
  } catch (error) {
    throw new Error(error.message);
  }
};


const updateOrderService = async (orderId, updateFields) => {
  try {
      const order = await Order.findById(orderId).populate('products.product_id');
      if (!order) {
          throw new Error('Order not found');
      }

      // Check if the order status is "Cancelled" or "Completed" and restrict updates if so
      if (order.status === 'Cancelled' || order.status === 'Completed') {
          throw new Error('Order cannot be updated because it is already in "Cancelled" or "Completed" status.');
      }

      // Handle `status` update with validation for "Completed" status
      if (updateFields.status) {
          if (updateFields.status === 'Completed') {
              // Ensure stock availability and deduct quantities if order is completed
              for (const item of order.products) {
                  const product = await Product.findById(item.product_id._id);
                  if (product.stock_quantity < item.quantity) {
                      throw new Error(`Insufficient stock to complete order for product ID ${item.product_id._id}`);
                  }

                  // Deduct stock quantity for each product in the order
                  product.stock_quantity -= item.quantity;
                  await product.save();
              }
              const user = await User.findById(order.user_id);
          if (!user) {
            throw new Error('User not found');
          }
  
          // Prepare dynamic data for the email
          const dynamicData = {
            userName: user.name || 'Customer',
            orderId: order._id,
            totalPrice: order.total_price,
            shippingAddress: `${order.shipping_address.address}, ${order.shipping_address.city}, ${order.shipping_address.state}, ${order.shipping_address.zipCode}, ${order.shipping_address.country}`,
            orderLink: `http://localhost:3000/orders/${order._id}`,
          };
  
          // Send order completion email
          await sendEmail(user.email, 'Your Order is Completed', 'orderCompleted', dynamicData);
        }
  
        // Update the order status
        order.status = updateFields.status;
      }
          
         
      // Handle `products` update
      if (updateFields.products) {
          let total_price = 0;

          // Validate each product, ensure stock availability, and recalculate total price
          for (const item of updateFields.products) {
              const product = await Product.findById(item.product_id);
              if (!product) {
                  throw new Error(`Product with ID ${item.product_id} not found.`);
              }
              if (product.stock_quantity < item.quantity) {
                  throw new Error(`Insufficient stock for product ID ${item.product_id}. Available quantity: ${product.stock_quantity}`);
              }
              total_price += product.price * item.quantity;
          }

          // Update the products and total price in the order
          order.products = updateFields.products.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
          }));
          order.total_price = total_price;
      }

      // Save the updated order
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

const findOrdersByUserId = async (user_id, status = null) => {
  try {
     // console.log('Received user_id in findOrdersByUserId:', user_id); // Should log the correct user_id

      const query = { user_id }; // Use `user_id` directly
      if (status) {
          query.status = { $in: status };
      }

      const orders = await Order.find(query).populate('products.product_id');
      //console.log('Orders found:', orders); 
      return orders;
  } catch (error) {
      console.error('Error in findOrdersByUserId:', error.message);
      throw new Error(error.message);
  }
};


const getOrdersByUserIdService = async (user_id) => {
  try {
      // Fetch all orders for the specified user ID
      const orders = await findOrdersByUserId(user_id);
      return orders;
  } catch (error) {
      throw new Error(error.message);
  }
};

const getCurrentOrderService = async (user_id) => {
  try {
    // Fetch only pending or in-progress orders for the specified user ID
    const [currentOrder] = await findOrdersByUserId(user_id, ['Pending', 'In Progress']);
    if (!currentOrder) {
      return { error: true, statusCode: 402, message: 'No current order found' };
    }
    return currentOrder;
  } catch (error) {
    console.error('Error in getCurrentOrderService:', error.message);
    return { error: true, statusCode: 500, message: error.message };
  }
};


module.exports = { createOrderService, updateOrderService,getOrderByIdService,getOrdersByUserIdService,getCurrentOrderService };
