const express= require ('express');
const mongoose = require('mongoose')

const app = express()

mongoose.connect("mongodb+srv://bionicle:Bionicle@123@bionicle.arrkp.mongodb.net/?retryWrites=true&w=majority&appName=Bionicle")

app.listen(4000, () => {
    console.log('server is running');
})