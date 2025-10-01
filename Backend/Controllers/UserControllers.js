const User = require("../Model/UserModel");

//data display
const getAllUsers = async (req, res, next) => {
    let users;

    try{
        users = await User.find();
    }catch (err){
        console.log(err);
    }

    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No Users Found" });
    }

    //display
    return res.status(200).json({users});
};

//data insert
const addUser = async (req, res, next) => {
    
    const{firstname, lastname, email, phonenumber, whoareyou, gender, birthday} = req.body;
    let users;

    try {
        users = new User({firstname, lastname, email, phonenumber, whoareyou, gender, birthday});
        await users.save(); 
    }catch (err){
         console.log(err);
    }

    if (!users) {
        return res.status(404).json({ message: "Unable to Add User" });
    }

    return res.status(200).json({users});
};

//get by id
const getById = async(req, res, next) => {
    const id = req.params.id;

    let users;

    try {
        users = await User.findById(id);
    }catch (err){
        console.log (err);
    }

    if (!users){
        return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json({users});
};
//get by username
const getByUsername = async(req, res, next) => {
    const username = req.params.username;
    
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// update user details
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { firstname, lastname, email, phonenumber, whoareyou, gender, birthday, status, profilePic, username, password } = req.body; // 👈 include status
  let users;

  try {
    users = await User.findByIdAndUpdate(
      id,
      { firstname, lastname, email, phonenumber, whoareyou, gender, birthday, status, profilePic, username, password }, // 👈 now status updates too
      { new: true } // return updated doc
    );
  } catch (err) {
    console.log(err);
  }

  if (!users) {
    return res.status(404).json({ message: "Unable to Update user Details" });
  }

  return res.status(200).json({ users });
};

//delete user
const deleteUser = async(req, res, next) => {
    const id = req.params.id;
    let users;

    try {
        users = await User.findByIdAndDelete(id);
    }catch (err){
        console.log(err);
    }

    if (!users){
        return res.status(404).json({ message: "Unable to Delete User"});
    }

    return res.status(200).json({users});
};


exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getByUsername = getByUsername;

