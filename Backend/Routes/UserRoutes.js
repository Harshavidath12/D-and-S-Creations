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

router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedUser);
  } catch (err) {
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
