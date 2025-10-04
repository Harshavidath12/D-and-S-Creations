const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"] // email format validation
  },
  contactNo: {
    type: String,
    required: [true, "Contact number is required"],
    trim: true,
    match: [/^\+?[0-9]{10,15}$/, "Please enter a valid contact number"] // phone number format validation
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be positive"]
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true
  },
  paymentMethod: {
    type: String,
    required: [true, "Payment method is required"],
    trim: true
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending"
  }
});

module.exports = mongoose.model("PaymentModel", paymentSchema);
