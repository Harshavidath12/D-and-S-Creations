const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    name: {
        type: String, // Full name of the customer
        required: true,
        trim: true
    },
    ledBoardType: {
        type: String, // Type of LED board
        required: true,
    },
    quantity: {
        type: Number, // Number of LED boards
        required: true,
        min: [1, "Quantity must be at least 1"],
    },
    location: {
        type: String, // Venue, City, Address
        required: true,
        trim: true
    },
    purpose: {
        type: String, // Purpose for renting
        required: true,
    },
    rentalStartDateTime: {
        type: Date, // Rental start date and time
        required: true,
    },
    rentalEndDateTime: {
        type: Date, // Rental end date and time
        required: true,
        validate: {
            validator: function(value) {
                // `this` refers to the current document being validated
                return value > this.rentalStartDateTime;
            },
            message: "Rental end date and time must be after the start date and time."
        }
    },
    paymentMethod: {
        type: String, // Payment method
        required: true,
    }
  
});

// Export the model
module.exports = mongoose.model("RentalModel", rentalSchema);
