const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase: true
    },
    phonenumber:{
        type:String,
        required:true,
    },
    whoareyou:{
        type:String,
        enum: ["FilmHall Owner", "LedBoard Owner", "Designer", "Client"],
        default: "Client"
    },
    gender:{
        type:String,
        enum: ["Male", "Female", "Other"],
        required:true,
    },
    birthday:{
        type:Date,
        required:true,
    },
    status:{ 
        type: String, 
        enum: ["Pending", "Active", "Rejected"], 
        default: "Pending" 
    }
    
});


module.exports = mongoose.model("NewUser", userSchema);