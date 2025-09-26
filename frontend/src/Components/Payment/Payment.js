import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import axios from "axios";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;

  const [userEmail, setUserEmail] = useState("");
  const [userContact, setUserContact] = useState("");
  const [amountToPay, setAmountToPay] = useState(booking ? booking.cost : "");  // ✅ default to booking.cost
  const [userAddress, setUserAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  if (!booking) {
    return (
      <div>
        <Nav />
        <p>No booking data found. Please go back and fill the form.</p>
      </div>
    );
  }

  // Validation function
  const validateForm = () => {
    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Contact number check (must be exactly 10 digits)
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(userContact)) {
      alert("Contact number must be exactly 10 digits.");
      return false;
    }

    // Amount check (must be positive)
    if (Number(amountToPay) <= 0) {
      alert("Amount must be a positive value.");
      return false;
    }

      //New: Amount must not exceed estimated cost
  if (Number(amountToPay) > booking.cost) {
    alert(`Amount cannot exceed the estimated cost (LKR ${booking.cost}).`);
    return false;
  }

    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validateForm()) return; // stop if validation fails

    try {
      const paymentData = {
        email: userEmail,
        contactNo: userContact,
        amount: Number(amountToPay),
        address: userAddress,
        paymentMethod: selectedMethod,
        paymentDate: new Date(),
        status: "Pending",
      };

      const response = await axios.post(
        "http://localhost:5000/payments",
        paymentData
      );
      console.log("Payment saved:", response.data);
      alert("Payment confirmed!");
      navigate("/");
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Something went wrong while saving your payment.");
    }
  };

  return (
    <div>
      <Nav />

      <div className="payment-container">
        <h1>Confirm Your Payment</h1>
        <div className="booking-summary">
          <h2>Booking Details</h2>
          <p><strong>Name:</strong> {booking.name}</p>
          <p><strong>LED Board Type:</strong> {booking.ledBoardType}</p>
          <p><strong>Quantity:</strong> {booking.quantity}</p>
          <p><strong>Location:</strong> {booking.location}</p>
          <p><strong>Purpose:</strong> {booking.purpose}</p>
          <p><strong>Rental Start:</strong> {booking.rentalStartDateTime}</p>
          <p><strong>Rental End:</strong> {booking.rentalEndDateTime}</p>
          <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
          <p><strong>Estimated Cost:</strong> LKR {booking.cost}</p>
        </div>

        <div className="payment-form">
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={userContact}
            onChange={(e) => setUserContact(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amountToPay}
            onChange={(e) => setAmountToPay(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            required
          />
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Online">Online</option>
          </select>
        </div>

        {selectedMethod === "Card" && (
          <div className="card-form">
            <h3>Payment Method</h3>
            <label>Card Information</label>
            <input type="text" placeholder="1234 1234 1234 1234" />
            <div className="card-inline">
              <input type="text" placeholder="MM / YY" />
              <input type="text" placeholder="CVC" />
            </div>
            <label>Cardholder Name</label>
            <input type="text" placeholder="Full name on card" />
          </div>
        )}

        <button className="confirm-btn" onClick={handleConfirmPayment}>
          Confirm Payment
        </button>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} D&S Creations. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Payment;

