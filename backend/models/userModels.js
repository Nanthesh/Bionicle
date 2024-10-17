var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({

    userName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Users", userSchema);