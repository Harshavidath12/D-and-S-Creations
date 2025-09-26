//const User = require("../Model/UserModel");
const User=require("../Model/RentalModel");

// Data display part

const getAllUsers = async (req, res, next) => {
  let users;

  // Get all users
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }

  // Not found
  if (!users) {
    return res.status(404).json({ message: "User not found" });
  }

  // Display all users
  return res.status(200).json({ users });
};


//Data Insert part

const addUsers= async(req, res, next)=> {
  const {name,ledBoardType,quantity,location,purpose,rentalStartDateTime,rentalEndDateTime,paymentMethod}=req.body;

  let users;

  try{
    users=new User({name,ledBoardType,quantity,location,purpose,rentalStartDateTime,rentalEndDateTime,paymentMethod});
    await users.save();//save to database
  }catch(err){
    console.log(err);
  }
  // if data is not getting inserted

  if(!users){
     return res.status(404).json({message:"unable to add users"});

  }
   return res.status(200).json({users});

};

//Get  by Id
const getById= async(req,res,next)=>{
    const id=req.params.id;

    let user;

    try{
        user=await User.findById(id);// me id ekata me user inawada
    }catch(err){
        console.log(err);
    }
    // not available users
    if(!user){
     return res.status(404).json({message:"Users not found"});

  }
   return res.status(200).json({user});

};



//Update user details
const updateUser=async(req,res,next)=>{
   const id=req.params.id;

    const {name,ledBoardType,quantity,location,purpose,rentalStartDateTime,rentalEndDateTime,paymentMethod}=req.body;

    let users;
    try{
       users=await User.findByIdAndUpdate(id,

       {name,ledBoardType,quantity,location,purpose,rentalStartDateTime,rentalEndDateTime,paymentMethod});
       users=await users.save();
    }catch(err){
      console.log(err);
    }
     if(!users){
     return res.status(404).json({message:"Unable to update user details"});

  }
   return res.status(200).json({users});
};


//Delete Uuser Details

const deleteUser=async(req,res,next)=>{
  const id=req.params.id;

  let user;// creating a variable

  try{
    user=await User.findByIdAndDelete(id) // this will get the id id and delete the data belong to that id
  }catch(err){
    console.log(err);
  }

   if(!user){
     return res.status(404).json({message:"Ubale to delete user details"});

  }
   return res.status(200).json({user});
};

// Example in BookingController
const addBooking = async (req, res) => {
  const { boardType, quantity } = req.body;

  // ✅ Find available boards
  const availableBoards = await Inventory.find({
    boardType,
    status: "Available"
  }).limit(quantity);

  // ❌ If not enough available boards
  if (availableBoards.length < quantity) {
    return res.status(400).json({ message: "Not enough stock available" });
  }

  // ✅ Reserve those boards
  for (let board of availableBoards) {
    board.status = "Rented";  // or "Reserved"
    await board.save();
  }

  // ✅ Save booking record
  const booking = new Booking(req.body);
  booking.assignedBoards = availableBoards.map(b => b.serialNo);
  await booking.save();

  res.status(201).json(booking);
};




exports.getAllUsers = getAllUsers;

exports.addUsers=addUsers;

exports.getById=getById;

exports.updateUser=updateUser;

exports.deleteUser=deleteUser;




