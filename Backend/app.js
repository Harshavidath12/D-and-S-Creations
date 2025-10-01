//E1gMihrKg842U8Sd

const express = require("express");
const mongoose=require("mongoose");
const router = require("./Routes/UserRoutes");



const app=express(); 
const cors = require("cors")



//Middleware
app.use(express.json());
app.use(cors());
app.use("/users",router);
app.use("/uploads", express.static("uploads"));



mongoose.connect("mongodb+srv://chenulrandiya10_db_user:PqxY5pnLfJSJ6PF3@cluster0.sp3lpkf.mongodb.net/test")
.then(()=> console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=> console.log((err)));


//call register
require("./Model/UserModel");
const User = mongoose.model("NewUser");
app.post("/users", async(req, res) => {
    const {username, password} =req.body;
    try{
        await User.create({
            username,
            password
        })
        res.send({status: "ok"});
    }catch (err){
        res.send({status: "err"});
    }
});


//call login
app.post("/login", async (req,res)=> {
  const {username, password} = req.body;
  try {
    const user = await User.findOne({username});
    if(!user){
      return res.json({err: "User not Found"})
    }
    if(user.password === password){
      return res.json({status: "ok", user});
    }else{
      return res.json({err: "incorrect password"});
    }
  }catch (err){
    console.error(err);
    res.status(500).json({err:"server error"});
  }
});
