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
    
    const{username, email, phonenumber, whoareyou, gender, birthday} = req.body;
    let users;

    try {
        users = new User({username, email, phonenumber, whoareyou, gender, birthday});
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

//update user details
const updateUser = async(req, res, next) => {
    const id = req.params.id;
    const{username, email, phonenumber, whoareyou, gender, birthday} = req.body;
    let users;

    try {
        users = await User.findByIdAndUpdate(id,{
            username: username, email: email, phonenumber: phonenumber, whoareyou: whoareyou, gender: gender, birthday: birthday
        });
        users = await users.save();
    }catch (err) {
        console.log(err);
    }

    if (!users){
        return res.status(404).json({ message: "Unable to Update user Details"});
    }

    return res.status(200).json({users});
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
