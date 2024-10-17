const express = require('express')
const app = express()
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/bionicleDB")
    .then(() => {
        console.log("Successfully, Connected to Database");
    })
    .catch((error) => {
        console.log("Error connecting to database", error);
    });
    
app.use(express.json());


app.listen(4000, function check(error)
{
    if (error)
    {
        console.log("Error...Server couldn't start!!!");
    }
    else{
        console.log("Server Started");
    }
});