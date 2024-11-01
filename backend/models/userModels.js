const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, required: true },
  firstName:{type:String, required:true},
  lastName:{type:String, required:true},
  email: { type: String, required: true },
  phone_number: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  password: { type: String },  
}, { timestamps: true });
  // Compare password method
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  };

module.exports = mongoose.model("Users", userSchema);
