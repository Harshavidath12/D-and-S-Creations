console.log("Byeeeeee");   
//E1gMihrKg842U8Sd

const mongoose=require("mongoose");
const express = require("express");
const router= require("./Routes/UserRoutes");
const pricingRoutes = require("./Routes/pricingRoutes"); // import pricing routes


const app=express(); 
const cors=require("cors");//calling the cors package which was installed

//to parse json request bodies
app.use(express.json());//use json data


//Middleware
app.use(express.json());//postmon eken insert krna data tika json ekata responsive wenna 
app.use(cors());
app.use("/users",router);

app.use("/pricing", pricingRoutes); // for pricing routes



mongoose.connect("mongodb+srv://admin:E1gMihrKg842U8Sd@cluster0.sp3lpkf.mongodb.net/")
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
        console.log("✅ Server running on http://localhost:5000");
    });
})
.catch((err) => console.log("❌ DB connection error:", err));

//register function ,call register model
/*
require("./Model/Register");
const User=mongoose.model("Register");//database table name
app.post("/register",async(req,res)=>{
    const{name,gmail,password}= req.body;
    try{
        await User.create({
            name,
            gmail,
            password,
        });
        res.send({status:"ok"});//if the function is running well
    }catch(err){
        res.send({status:"err"});
    }
});
*/

//Login ------------
/*
app.post("/login",async(req,res)=>{
    const {gmail,password}=req.body;
    try{
        const user=await User.findOne({gmail});
        if(!user){//if user not registered in database
            return res.json({err:"user Not Found"})
        }
        if(user.password===password){
            return res.json({status:"ok"});
        }else{
            return res.json({err:"incorrect pwd"});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({err:"Server Err"})
    }
})

*/

//Image Part

/*require("./Model/ImgModel");
const ImgSchema=mongoose.model("ImgModel");

const multerimg=require("multer");

const storageimg=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"../frontend/src/Components/ImgUploader/files");
    },
    filename:function(req,file,cb){
        const uniqueSuffix=Date.now();
        cb(null,uniqueSuffix+ file.originalname);
    },
});

const uploadimg=multerimg({storage:storage});

app.post("/uplodeImg",upload.single("image"),async(req,res)=>{
    console.log(req.body);
    const imageName=req.file.filename;

    try{
        await ImgSchema.create({Image:imageName});
        res.json({status:"ok"});
    }catch(error){
         res.json({status:error});
    }
});

//Display image
app.get("/getImage",async(req,res)=>{
    try{
        ImgSchema.find({}).then((data)=>{
            res.send({status:"ok",data:data});
        });
    }catch(error){
        res.json({status:error});
    }
});
*/