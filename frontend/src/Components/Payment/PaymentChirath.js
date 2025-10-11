import React, { useState } from "react";
import Nav2 from "../Nav/Nav2";
import { useNavigate } from "react-router";
const PaymentChirath = () => {
    const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholder, setCardholder] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment Successful!");
    navigate("/mainhome");
  };

  return (
    <div>
        <Nav2 />
   
    <div className="payment-container">
      <form className="payment-form" onSubmit={handleSubmit}>
        <h2>Payment Method</h2>

        <label className="section-label">Card Information</label>
        <input
          type="text"
          className="input-field"
          placeholder="1234 1234 1234 1234"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />

        <div className="card-details">
          <input
            type="text"
            className="input-field"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            required
          />
        </div>

        <label className="section-label">Cardholder Name</label>
        <input
          type="text"
          className="input-field"
          placeholder="Full name on card"
          value={cardholder}
          onChange={(e) => setCardholder(e.target.value)}
          required
        />

        <button type="submit" className="confirm-btn">
          Confirm Payment
        </button>
      </form>
    </div>
     </div>
  );
};

export default PaymentChirath;
