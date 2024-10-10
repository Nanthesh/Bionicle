const bcrypt = require('bcryptjs');
const connectMongoDB = require('./database/Mongo.database');
const User = require('./models/userModel');

// Insert users into the database
const importUsers = async () => {
  try {
    const users = [
      {
        users_id: "1",
        username: "bionicleTest",
        password: await bcrypt.hash("password123", 10), // Hash the password
        email: "c0891259@mylambton.ca",
      }
    ];

    await User.insertMany(users);
    console.log('Users inserted successfully');
    process.exit();
  } catch (error) {
    console.error('Error inserting users:', error);
    process.exit(1);
  }
};

// Connect to MongoDB and then import users
connectMongoDB().then(importUsers);
