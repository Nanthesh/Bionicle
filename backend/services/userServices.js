const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");

module.exports.createUserDBService = (userDetails) => {
  return new Promise(async function userModelFunc(resolve, reject) {
    try {
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
          reject(false);
        } else {
          resolve(true);
        }
      });
    } catch (error) {
      reject(false); // In case of any error in hashing or saving
    }
  });
};
