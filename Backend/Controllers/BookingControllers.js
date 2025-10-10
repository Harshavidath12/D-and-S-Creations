const User = require("../Model/RentalModel"); // Rental bookings
const Stock = require("../Model/StockModel"); // Inventory

// ===================== USERS / RENTALS ===================== //

// Get all users (rentals)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No rentals found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add rental booking (only if stock available)
const addUsers = async (req, res, next) => {
  const {
    name,
    ledBoardType,
    quantity,
    location,
    purpose,
    rentalStartDateTime,
    rentalEndDateTime,
    paymentMethod,
  } = req.body;

  try {
    // ✅ Find available stock
    const availableBoards = await Stock.find({
      boardType: ledBoardType,
      status: "Available",
    }).limit(quantity);

    if (availableBoards.length < quantity) {
      return res
        .status(400)
        .json({ message: "Not enough stock available for booking" });
    }

    // ✅ Save rental/booking record first
    const booking = new User({
      name,
      ledBoardType,
      quantity,
      location,
      purpose,
      rentalStartDateTime,
      rentalEndDateTime,
      paymentMethod,
    });

    await booking.save();

    // ✅ Mark boards as rented and link booking._id
    for (let board of availableBoards) {
      board.status = "Rented";
      board.assignedToBooking = booking._id;
      await board.save();
    }

    return res.status(201).json({
      message: "Booking successful",
      booking,
      rentedBoards: availableBoards,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error while booking" });
  }
};

// Get booking by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update booking
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const {
    name,
    ledBoardType,
    quantity,
    location,
    purpose,
    rentalStartDateTime,
    rentalEndDateTime,
    paymentMethod,
  } = req.body;

  try {
    let user = await User.findByIdAndUpdate(
      id,
      {
        name,
        ledBoardType,
        quantity,
        location,
        purpose,
        rentalStartDateTime,
        rentalEndDateTime,
        paymentMethod,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Unable to update booking" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete booking
const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Unable to delete booking" });
    }

    // ✅ Free up linked stock
    await Stock.updateMany(
      { assignedToBooking: user._id },
      { $set: { status: "Available", assignedToBooking: null } }
    );

    return res.status(200).json({ message: "Booking deleted", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;