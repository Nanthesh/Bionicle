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
        validate: {
          validator: function(v) {
            // Regex for Canadian phone numbers (formats: 123-456-7890, (123) 456-7890, 1234567890)
            return /^(\+1\s?)?(\(?[2-9][0-9]{2}\)?[\s.-]?)[2-9][0-9]{2}[\s.-]?[0-9]{4}$/.test(v);
          },
          message: props => `${props.value} is not a valid Canadian phone number!`
        }
    }
});

module.exports = mongoose.model("users", userSchema);