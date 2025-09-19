//E1gMihrKg842U8Sd

const express = require("express");
const mongoose=require("mongoose");
const router = require("./Routes/UserRoutes");
//const router = require("./Routes/UserRoutes");



const app=express(); 



//Middleware
app.use(express.json());
app.use("/users",router)
//app.use("/users",router)



mongoose.connect("mongodb+srv://admin:E1gMihrKg842U8Sd@cluster0.sp3lpkf.mongodb.net/")
mongoose.connect("mongodb+srv://vihigum:H4UiHdZM640pbRnI@cluster0.sp3lpkf.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=> console.log((err)));