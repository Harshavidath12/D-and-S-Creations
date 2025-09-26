const Stock = require("../Model/StockModel");

// Get all stock items
const getAllStock = async (req, res, next) => {
  try {
    const stock = await Stock.find();
    if (!stock || stock.length === 0) {
      return res.status(404).json({ message: "No stock found" });
    }
    return res.status(200).json({ stock });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add new stock item
const addStock = async (req, res, next) => {
  const { boardType, serialNo, status, purchaseDate, warrantyExpiry, assignedToBooking } = req.body;

  try {
    const stock = new Stock({
      boardType,
      serialNo,
      status,
      purchaseDate,
      warrantyExpiry,
      assignedToBooking,
    });
    await stock.save();
    return res.status(201).json({ stock });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add stock" });
  }
};

// Get stock by ID
const getStockById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    return res.status(200).json({ stock });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update stock
const updateStock = async (req, res, next) => {
  const id = req.params.id;
  const { boardType, serialNo, status, purchaseDate, warrantyExpiry, assignedToBooking } = req.body;

  try {
    let stock = await Stock.findByIdAndUpdate(
      id,
      { boardType, serialNo, status, purchaseDate, warrantyExpiry, assignedToBooking },
      { new: true }
    );
    if (!stock) {
      return res.status(404).json({ message: "Unable to update stock" });
    }
    return res.status(200).json({ stock });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete stock
const deleteStock = async (req, res, next) => {
  const id = req.params.id;
  try {
    const stock = await Stock.findByIdAndDelete(id);
    if (!stock) {
      return res.status(404).json({ message: "Unable to delete stock" });
    }
    return res.status(200).json({ message: "Stock deleted", stock });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllStock = getAllStock;
exports.addStock = addStock;
exports.getStockById = getStockById;
exports.updateStock = updateStock;
exports.deleteStock = deleteStock;
