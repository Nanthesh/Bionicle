const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "random#secret";

module.exports.createUserDBService = (userDetails) => {
    return new Promise(async function userModelFunc(resolve, reject) {
        try {
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

            // Create new user model
            const userModelData = new userModel({
                userName: userDetails.userName,
                email: userDetails.email,
                phone_number: userDetails.phone_number || 'N/A',
            });

            // Hash password if provided (manual signup)
            if (userDetails.password) {
                const salt = await bcrypt.genSalt(10);
                userModelData.password = await bcrypt.hash(userDetails.password, salt);
            }

            await userModelData.save();

            const token = jwt.sign({ id: userModelData._id, email: userModelData.email }, SECRET_KEY, { expiresIn: '1h' });
            resolve({ status: true, message: "User registered successfully", token });
        } catch (error) {
            reject({ status: false, message: "Error getting token", error });
        }
    });
};
