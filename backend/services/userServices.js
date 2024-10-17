const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");

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

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(userDetails.email)) {
        reject({ status: false, message: "Invalid email format" });
        return;
      }

      // Create new user model
      const userModelData = new userModel();

      // Set the user details from the request
      userModelData.userName = userDetails.userName;
      userModelData.email = userDetails.email;
      userModelData.phone_number = userDetails.phone_number;

      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userDetails.password, salt);

      // Set the hashed password
      userModelData.password = hashedPassword;

      // Save the user to the database
      userModelData.save(function resultHandle(error, result) {
        if (error) {
          reject({ status: false, message: "Error creating user" });
        } else {
          resolve({ status: true, message: "User registered successfully" });
        }
      });
    } catch (error) {
      reject({ status: false, message: "Internal server error" }); // In case of any error in hashing or saving
    }
  });
};
const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");

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

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(userDetails.email)) {
        reject({ status: false, message: "Invalid email format" });
        return;
      }

      // Create new user model
      const userModelData = new userModel();

      // Set the user details from the request
      userModelData.userName = userDetails.userName;
      userModelData.email = userDetails.email;
      userModelData.phone_number = userDetails.phone_number;

      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userDetails.password, salt);

      // Set the hashed password
      userModelData.password = hashedPassword;

      // Save the user to the database
      userModelData.save(function resultHandle(error, result) {
        if (error) {
          reject({ status: false, message: "Error creating user" });
        } else {
          resolve({ status: true, message: "User registered successfully" });
        }
      });
    } catch (error) {
      reject({ status: false, message: "Internal server error" }); // In case of any error in hashing or saving
    }
  });
};
