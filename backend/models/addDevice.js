const mongoose =require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema= new Schema({
    deviceName:
    {
        type:String,
        required:true
    },
    modelNumber :
    {
        type:String,
        required:true,
    },
    voltage:
    {
        type:Number,
        required:true
    },
    deviceType:
    {
        type:String,
        required:true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

},{timestamps:true});
module.exports = mongoose.model('Device', deviceSchema);