// Controllers/PricingController.js
const Pricelist = require("../Model/Pricelist");

// Get all pricing records
const getAllPrices = async (req, res) => {
  try {
    const prices = await Pricelist.find();
    return res.status(200).json(prices);
  } catch (err) {
    console.error("Error fetching prices:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Add new price entry
const addPrice = async (req, res, next) => {
  const { boardType, dailyRate, hourlyRate } = req.body;

  let price;
  try {
    price = new Pricelist({ boardType, dailyRate, hourlyRate });
    await price.save();
  } catch (err) {
    console.log(err);
  }

  if (!price) {
    return res.status(400).json({ message: "Unable to add pricing" });
  }
  return res.status(200).json({ price });
};

// Get price by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  let price;
  try {
    price = await Pricelist.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!price) {
    return res.status(404).json({ message: "Price record not found" });
  }
  return res.status(200).json({ price });
};

//Update price entry
const updatePrice = async (req, res, next) => {
  const id = req.params.id;
  const { boardType, dailyRate, hourlyRate } = req.body;

  let price;
  try {
    price = await Pricelist.findByIdAndUpdate(
      id,
      { boardType, dailyRate, hourlyRate },
      { new: true } // return updated doc
    );
  } catch (err) {
    console.log(err);
  }

  if (!price) {
    return res.status(404).json({ message: "Unable to update price" });
  }
  return res.status(200).json({ price });
};

// Delete price entry
const deletePrice = async (req, res, next) => {
  const id = req.params.id;
  let price;
  try {
    price = await Pricelist.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!price) {
    return res.status(404).json({ message: "Unable to delete price" });
  }
  return res.status(200).json({ price });
};

exports.getAllPrices = getAllPrices;
exports.addPrice = addPrice;
exports.getById = getById;
exports.updatePrice = updatePrice;
exports.deletePrice = deletePrice;
