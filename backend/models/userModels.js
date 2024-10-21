const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    phone_number: { type: String, required: true },
}, { timestamps: true });

  // Compare password method
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  };

module.exports = mongoose.model("Users", userSchema);
