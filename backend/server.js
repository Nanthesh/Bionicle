const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes');
const profileRoutes = require("./routes/profileRoutes");
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
app.listen(4000, () => {
  console.log('Server running on port 4000');
});
