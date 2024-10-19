var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: function() { return !this.provider; } // Password required if not using social provider
    },
    phone_number: {
        type: String,
        required: function() { return !this.provider; } // Phone number required if not using social provider
    },
    uid: {
        type: String, // UID for Google/Firebase users
        required: false
    },
    provider: {
        type: String, // Provider (e.g., 'google')
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Users", userSchema);
