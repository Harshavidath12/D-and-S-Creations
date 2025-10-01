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

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Use this for updating user with profile picture
router.put("/:id", upload.single("ProfilePic"), async (req, res) => {
  const id = req.params.id;

  // Destructure text fields from req.body
  const { firstname, lastname, email, phonenumber, whoareyou, gender, birthday } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        email,
        phonenumber,
        whoareyou,
        gender,
        birthday,
        profilePic: req.file ? req.file.filename : undefined
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
//export
module.exports = router;
