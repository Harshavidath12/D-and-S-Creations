const LedModel = require("../Model/LedModel"); // make sure this path matches your file name

// ✅ Get all LED board records
const getAllLedBoards = async (req, res, next) => {
  let ledBoards;

  try {
    ledBoards = await LedModel.find();
  } catch (err) {
    console.log(err);
  }

  if (!ledBoards || ledBoards.length === 0) {
    return res.status(404).json({ message: "No LED Board Records Found" });
  }

  return res.status(200).json({ ledBoards });
};

// ✅ Add new LED board record
const addLedBoard = async (req, res, next) => {
  const { outDoor, inDoor, p3, p6, ownerId } = req.body;
  let ledBoard;

  try {
    ledBoard = new LedModel({
      outDoor,
      inDoor,
      p3,
      p6,
      ownerId,
    });
    await ledBoard.save();
  } catch (err) {
    console.log(err);
  }

  if (!ledBoard) {
    return res.status(404).json({ message: "Unable to Add LED Board Data" });
  }

  return res.status(200).json({ ledBoard });
};

// ✅ Get by ID
const getLedBoardById = async (req, res, next) => {
  const id = req.params.id;
  let ledBoard;

  try {
    ledBoard = await LedModel.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!ledBoard) {
    return res.status(404).json({ message: "LED Board Record Not Found" });
  }

  return res.status(200).json({ ledBoard });
};

//get by username
const getLedBoardByUsername = async (req, res, next) => {
    const ownerId = req.params.ownerId;
    
    try {
        const ledBoard = await LedModel.findOne({ ownerId });
        if (!ledBoard) {
            return res.status(404).json({ message: "User Not Found" });
        }
        return res.status(200).json({ ledBoard });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Update LED board record
const updateLedBoard = async (req, res, next) => {
  const id = req.params.id;
  const { outDoor, inDoor, p3, p6 } = req.body;
  let ledBoard;

  try {
    ledBoard = await LedModel.findByIdAndUpdate(
      id,
      { outDoor, inDoor, p3, p6},
      { new: true } // return updated document
    );
  } catch (err) {
    console.log(err);
  }

  if (!ledBoard) {
    return res.status(404).json({ message: "Unable to Update LED Board Record" });
  }

  return res.status(200).json({ ledBoard });
};


exports.getAllLedBoards = getAllLedBoards;
exports.addLedBoard = addLedBoard;
exports.getLedBoardById = getLedBoardById;
exports.getLedBoardByUsername = getLedBoardByUsername;
exports.updateLedBoard = updateLedBoard;
