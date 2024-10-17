const dotenv = require('dotenv');
const express = require('express')
const app = express()
const mongoose = require('mongoose');
var routes = require("./routes/routes")

dotenv.config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Successfully, Connected to Database");
    })
    .catch((error) => {
        console.log("Error connecting to database", error);
    });

app.use(express.json());
app.use(routes);


app.listen(4000, function check(error)
{
    if (error)
    {
        console.log("Error...Server couldn't start!!!");
    }
    else{
        console.log("Server Started at 4000");
    }
});