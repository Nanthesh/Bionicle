const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    phone_number: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Users", userSchema);
