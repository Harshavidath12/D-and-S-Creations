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

userSchema.pre('save', function (next) {
  if (this.phonenumber) {
    // if starts with 0 → strip 0 and add +94
    if (this.phonenumber.startsWith('0')) {
      const withoutZero = this.phonenumber.substring(1); // e.g. 753334782
      this.phonenumber = '+94' + withoutZero;            // e.g. 94753334782
    } 
  }
  next();
});

module.exports = mongoose.model("NewUser", userSchema);