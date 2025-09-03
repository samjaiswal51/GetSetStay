const express = require("express");
const app = express();
const mongoose = require("mongoose");

const port = 8080;


main()
.then((res)=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log("Error connecting to DB", err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/getsetstay");
    
}


app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`);
})

app.get("/",(req,res)=>{
    res.send("Hello World");
})