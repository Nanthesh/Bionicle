const { createOrderService, updateOrderStatusService,getOrderByIdService  } = require('../services/orderService');

// Create a new order
const createOrder = async (req, res) => {
  const { user_id, products } = req.body;

  try {
    const newOrder = await createOrderService(user_id, products);
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Update an existing order status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await updateOrderStatusService(orderId, status);
    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(400).json({ message: 'Error updating order', error: error.message });
  }
};

//Retrieve order
const getOrderById = async (req, res) => {
    try {
      const order = await getOrderByIdService(req.params.orderId);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
  };

module.exports = { createOrder, updateOrderStatus,getOrderById };
