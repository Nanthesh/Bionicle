const userModel = require("../models/userModels");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "random#secret";

module.exports.createUserDBService = (userDetails) => {
  return new Promise(async function userModelFunc(resolve, reject) {
    try {
      // Check if the email or username already exists
      const existingUser = await userModel.findOne({
        $or: [{ email: userDetails.email }, { userName: userDetails.userName }],
      });

      if (existingUser) {
        if (existingUser.email === userDetails.email) {
          reject({ status: false, message: "Email is already registered" });
        } else if (existingUser.userName === userDetails.userName) {
          reject({ status: false, message: "Username is already taken" });
        }
        return;
      }

      // If password exists, hash it; otherwise skip hashing for social sign-ins
      let hashedPassword = undefined;
      if (userDetails.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(userDetails.password, salt);
      }

      // Create new user model
      const userModelData = new userModel({
        userName: userDetails.userName,
        email: userDetails.email,
        phone_number: userDetails.phone_number || '', // Set empty if not provided
        password: hashedPassword, // Store the hashed password or undefined
        uid: userDetails.uid, // Store the Firebase UID for Google users
        provider: userDetails.provider // Store the provider (e.g., 'google')
      });

      // Save the user to the database
      await userModelData.save();

      // Create a JWT token after successful registration
      const token = jwt.sign(
        { id: userModelData._id, email: userModelData.email },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      // Return the success result with the token
      resolve({ status: true, message: "User registered successfully", token });
    } catch (error) {
      // Reject with an appropriate error message
      reject({ status: false, message: "Error getting token", error });
    }
  });
};



