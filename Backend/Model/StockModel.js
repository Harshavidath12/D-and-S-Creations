const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema(
  {
    boardType: {
      type: String, // Outdoor, Indoor, P3, etc.
      required: true,
      trim: true,
    },
    serialNo: {
      type: String, // unique identifier like OUT-01
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Rented", "Under Maintenance", "Damaged", "Reserved"],
      default: "Available",
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    warrantyExpiry: {
      type: Date,
      required: true,
    },
    assignedToBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentalModel", // link to your rental if reserved
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockModel", stockSchema);
