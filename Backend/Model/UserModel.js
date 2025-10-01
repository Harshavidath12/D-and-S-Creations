const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
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
        enum: ["Client", "FilmHall Owner", "LedBoard Owner", "Designer", "Admin"],
        required:true,
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
    },
    profilePic: {
        type: String, // just store the file path or image URL
        default: "no pic"   // empty until user uploads
    },
    username:{
        type:String,
        default: "Not Yet"
    },
    password:{
        type:String,
        default: "Not Yet"
    }
    
});


module.exports = mongoose.model("NewUser", userSchema);