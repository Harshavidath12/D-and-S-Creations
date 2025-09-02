console.log("Byeeeeee");   
//E1gMihrKg842U8Sd

const mongoose=require("mongoose");
const express = require("express");



const app=express(); 



//Middleware
app.use("/",(req,res,next)=>{
    res.send("Hello from express");
});


mongoose.connect("mongodb+srv://admin:E1gMihrKg842U8Sd@cluster0.sp3lpkf.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5001);
    app.listen(5000);
})
.catch((err)=> console.log((err)));