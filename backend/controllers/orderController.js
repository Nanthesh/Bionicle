const { createOrderService, updateOrderService,getOrderByIdService,getCurrentOrderService,getOrdersByUserIdService  } = require('../services/orderService');
const redisClient = require('../database/redisClient');

// Create a new order
const createOrder = async (req, res) => {
  const { products,shipping_address} = req.body;
  const user_id = req.user.id; 
  console.log('Received request body:', req.body);

  try {
    const newOrder = await createOrderService(user_id, products,shipping_address);
    if (
        !shipping_address ||
        !shipping_address.address ||
        !shipping_address.city ||
        !shipping_address.state ||
        !shipping_address.zipCode ||
        !shipping_address.country
      ) {
        return res.status(400).json({
          message: 'Error creating order',
          error: 'All fields in shipping_address are required: address, city, state, zipCode, country.',
        });
    }
    await redisClient.del(`orders:${req.user.id}`);
    console.log(`orders:${req.user.id}`);
    await redisClient.del('products:/api/products')
    await redisClient.del(`orders:${req.user.id}:current`);
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
};

// Update an existing order status
const updateOrder = async (req, res) => { 
  const { orderId } = req.params;
  const { status } = req.body;

  try {

     const updatedOrder = await updateOrderService(orderId, { status });
      // Invalidate cache for the user's orders

      await redisClient.del(`orders:${updatedOrder.user_id}`);
      console.log('Deleted all user orders cache.');

      await redisClient.del(`orders:${updatedOrder.user_id}:current`);
      console.log('Deleted current order cache.');

      res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
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

  const getOrdersByUserId = async (req, res) => {
    const cacheKey = `orders:${req.user.id}`; // Unique key for each user's orders

    try {
        // Check if the orders data is in the cache
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
            const orders = await getOrdersByUserIdService(req.user.id);
            if (orders) {
                // Cache the orders data for future requests
                redisClient.set(cacheKey, JSON.stringify(orders), 'EX', 3600, (setErr, reply) => {
                    if (setErr) {
                        console.error('Redis Set Error:', setErr);
                    } else {
                        console.log('Data Cached at Key:', cacheKey, 'Reply:', reply); // Should log "OK"
                    }
                });
            }

            res.status(200).json(orders);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};


const getCurrentOrder = async (req, res) => {
  const cacheKey = `currentOrder:${req.user.id}`; // Unique key for each user's current order

  try {
      // Check if the current order data is in the cache
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
          const order = await getCurrentOrderService(req.user.id);
          if (order) {
              // Cache the current order data for future requests
              redisClient.set(cacheKey, JSON.stringify(order), 'EX', 3600, (setErr, reply) => {
                  if (setErr) {
                      console.error('Redis Set Error:', setErr);
                  } else {
                      console.log('Data Cached at Key:', cacheKey, 'Reply:', reply); // Should log "OK"
                  }
              });
          }

          res.status(200).json(order);
      });
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving current order', error: error.message });
  }
};

module.exports = { createOrder, updateOrder,getOrderById,getCurrentOrder,getOrdersByUserId };
