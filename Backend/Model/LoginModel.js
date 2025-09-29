const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const regiSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    whoareyou:{
        type:String,
        enum: ["Client", "FilmHall Owner", "LedBoard Owner", "Designer", "Admin"],
        required:true,
    }
    
});


module.exports = mongoose.model("registers", regiSchema);