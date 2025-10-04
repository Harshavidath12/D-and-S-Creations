const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//insert model
const User = require("../Model/UserModel");
//insert user
const UserController = require("../Controllers/UserControllers");

router.get("/",UserController.getAllUsers);
router.post("/",UserController.addUser);
router.get("/:id",UserController.getById);
router.put("/:id",UserController.updateUser);
router.delete("/:id",UserController.deleteUser);
router.get("/username/:username", UserController.getByUsername);


//udate to login
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password, status } = req.body; // destructure all fields

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,{ username, password, status }, // update all fields
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
