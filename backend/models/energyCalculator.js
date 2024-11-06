const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const energyCalculator = new Schema({
        amp:
         {
            type: Number,
            require: true
         },
         voltage:
         {
            type:Number
         }

});

