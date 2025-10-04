const express= require("express");
const router= express.Router();

//Insert Model
//const User= require("../Model/UserModel");

//Insert User Controller
const BookingControllers=require("../Controllers/BookingControllers");
 
router.get("/",BookingControllers.getAllUsers);

router.post("/",BookingControllers.addUsers);

router.get("/:id",BookingControllers.getById);

router.put("/:id",BookingControllers.updateUser);

router.delete("/:id",BookingControllers.deleteUser);



//export
module.exports=router;