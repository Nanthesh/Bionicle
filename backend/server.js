const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes');
const profileRoutes = require("./routes/profileRoutes");
const deviceRoutes = require("./routes/DeviceRoutes");
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes')
const paymentRoutes = require('./routes/paymentRoutes'); 
const energyCalculatorRoutes = require('./routes/energyCalculatorRoutes');
dotenv.config();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to Database");
  })
  .catch((error) => {
    console.log("Error connecting to database", error);
  });

app.use('/', routes);
app.use('/', profileRoutes);
app.use('/api', routes);
app.use('/api/devices', deviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', energyCalculatorRoutes);
app.listen(4000, () => {
  console.log('Server running on port 4000');
});
