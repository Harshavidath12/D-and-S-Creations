const mongoose = require("mongoose");
const Counter = require("./CounterModel");

const rentalSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  name: { type: String, required: true, trim: true },
  ledBoardType: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  location: { type: String, required: true, trim: true },
  purpose: { type: String, required: true },
  rentalStartDateTime: { type: Date, required: true },
  rentalEndDateTime: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.rentalStartDateTime;
      },
      message:
        "Rental end date and time must be after the start date and time.",
    },
  },
  paymentMethod: { type: String, required: true },
});

// ✅ Pre-save hook to auto-generate sequential bookingId
rentalSchema.pre("save", async function (next) {
  try {
    if (this.isNew && !this.bookingId) {
      const counter = await Counter.findOneAndUpdate(
        { name: "bookingId" },       // counter name
        { $inc: { seq: 1 } },        // increment by 1
        { new: true, upsert: true }  // create if doesn't exist
      );

      this.bookingId = "LED" + String(counter.seq).padStart(3, "0");
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("RentalModel", rentalSchema);
