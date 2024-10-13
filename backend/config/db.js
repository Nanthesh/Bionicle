// require ('dotenv').config();
// const mongoose = require("mongoose");

// MongoOIDCError.connect(
//     process.enc.MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology:true,   
// })
// .then(()=>{
//     console.log("Database connected successfully.");
// })
// .catch((err)=>console.log(err));

// ------- logics for connecting to the database  -------
// import mongoose from "mongoose"

// export const connectDB = async () => {
//     await mongoose.connect('mongodb+srv://bionicle:Bionicle@123@bionicle.arrkp.mongodb.net/?retryWrites=true&w=majority&appName=Bionicle').then(()=>console.log("Database Connected"))
// }

const mongoose = require('mongoose');

 export const connectDB = async () => {
   await mongoose.connect('mongodb+srv://bionicle:Bionicle@123@bionicle.arrkp.mongodb.net/?retryWrites=true&w=majority&appName=Bionicle').then(()=>console.log("Database Connected"))
}



