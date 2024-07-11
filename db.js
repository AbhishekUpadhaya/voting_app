const mongoose = require("mongoose");
require('dotenv').config();//using the dotenv

//getting the mongodb url 
const mongo_url=process.env.MONGODB_URL_LOCAL;

//You can connect to MongoDB with the mongoose.connect() method.

mongoose.connect(mongo_url);
//creating a object db 
const db = mongoose.connection;
db.on('connected' ,()=>{
    console.log("connected to MongoDb server")
})
db.on('error' ,()=>{
    console.log("connected Error")
})
db.on('disconnected' ,()=>{
    console.log("Disconnected to MongoDb server")
})

//export a database connection
module.exports=db;