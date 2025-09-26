import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./LedBoard.css";
import axios from "axios";
import User from "../User/User";
import { useNavigate, useLocation } from "react-router-dom";

const USERS_URL = "http://localhost:5000/users";
const PRICING_URL = "http://localhost:5000/pricing"; // Your backend endpoint

const fetchHandler = async () => {
  return await axios.get(USERS_URL).then((res) => res.data);
};

function LedBoard() {
  const location = useLocation();
  const history = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    ledBoardType: "",
    quantity: 1,
    location: "",
    purpose: "",
    rentalStartDateTime: "",
    rentalEndDateTime: "",
    paymentMethod: "",
  });

  const [cost, setCost] = useState(0);

  // Fetch pricing from backend
  const [pricing, setPricing] = useState({});

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await axios.get(PRICING_URL);
        const pricingObj = {};
        res.data.forEach((item) => {
          pricingObj[item.boardType] = {
            daily: item.dailyRate,
            extraHour: item.hourlyRate,
          };
        });
        setPricing(pricingObj);
      } catch (err) {
        console.error("Error fetching pricing:", err);
      }
    };
    fetchPricing();
  }, []);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submitted:", inputs);

  try {
    // Send data to backend
    await sendRequest();

    // Add cost to inputs
    const bookingDetails = { ...inputs, cost };

    // Navigate to payment page with state
    history("/payment", { state: bookingDetails });
  } catch (err) {
    console.error("Error submitting booking:", err);
  }
};


/*
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", inputs);
    sendRequest().then(() => history("/userdetails"));
  };*/

  const sendRequest = async () => {
    await axios
      .post(USERS_URL, {
        name: String(inputs.name),
        ledBoardType: String(inputs.ledBoardType),
        quantity: String(inputs.quantity),
        location: String(inputs.location),
        purpose: String(inputs.purpose),
        rentalStartDateTime: String(inputs.rentalStartDateTime),
        rentalEndDateTime: String(inputs.rentalEndDateTime),
        paymentMethod: String(inputs.paymentMethod),
      })
      .then((res) => res.data);
  };

  const [ledboards, setLedBoards] = useState([]);
  useEffect(() => {
    fetchHandler().then((data) => setLedBoards(data.ledboards));
  }, []);

  const calculateCost = () => {
    const { ledBoardType, rentalStartDateTime, rentalEndDateTime, quantity } = inputs;
    if (!ledBoardType || !rentalStartDateTime || !rentalEndDateTime) {
      setCost(0);
      return;
    }

    const start = new Date(rentalStartDateTime);
    const end = new Date(rentalEndDateTime);
    if (end <= start) {
      setCost(0);
      return;
    }

    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffHours / 24);
    const extraHours = diffHours % 24;

    const boardPricing = pricing[ledBoardType];
    if (!boardPricing) return;

    let totalCost = 0;
    if (diffHours < 24) {
      totalCost = diffHours * boardPricing.extraHour;
    } else {
      totalCost = days * boardPricing.daily + extraHours * boardPricing.extraHour;
    }

    totalCost *= parseInt(quantity) || 1;
    setCost(totalCost);
  };

  useEffect(() => {
    calculateCost();
  }, [inputs, pricing]);

  return (
    <div>
      <Nav />

      <div>
        {ledboards &&
          ledboards.map((ledboard, i) => (
            <div key={i}>
              <User ledboard={ledboard} />
            </div>
          ))}
      </div>

      <div className="ledboard-categories">
        <h2>LED Boards Categories</h2>
        <div className="categories-grid">
          {Object.keys(pricing).map((boardType) => (
            <div className="category-card" key={boardType}>
              <img
                src={`/images/${boardType.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                alt={boardType}
              />
              <h3>{boardType}</h3>
              <p>
                LKR {pricing[boardType]?.daily || 0} per day + LKR{" "}
                {pricing[boardType]?.extraHour || 0} per extra hour
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="ledboard-container">
        <h1>Rent an LED Board</h1>
        <p className="intro-text">
          Rent high-quality LED boards for school events, university functions,
          hotels, weddings, concerts, conferences, and more.
        </p>

        <form className="ledboard-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" value={inputs.name} onChange={handleChange} required />

          <label>Type of LED Board</label>
          <select name="ledBoardType" value={inputs.ledBoardType} onChange={handleChange} required>
            <option value="">-- Select Type --</option>
            {Object.keys(pricing).map((boardType) => (
              <option key={boardType} value={boardType}>
                {boardType}
              </option>
            ))}
          </select>

          <label>Quantity</label>
          <input type="number" name="quantity" min="1" value={inputs.quantity} onChange={handleChange} required />

          <label>Location</label>
          <input type="text" name="location" value={inputs.location} onChange={handleChange} required />

          <label>Purpose</label>
          <select name="purpose" value={inputs.purpose} onChange={handleChange} required>
            <option value="">-- Select Purpose --</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Wedding">Wedding</option>
            <option value="Concert">Concert</option>
            <option value="Conference">Conference</option>
            <option value="School Event">School Event</option>
            <option value="University Event">University Event</option>
          </select>

          <label>Rental Start Date & Time</label>
          <input type="datetime-local" name="rentalStartDateTime" value={inputs.rentalStartDateTime} onChange={handleChange} required />

          <label>Rental End Date & Time</label>
          <input type="datetime-local" name="rentalEndDateTime" value={inputs.rentalEndDateTime} onChange={handleChange} required />

          <label>Payment Method</label>
          <select name="paymentMethod" value={inputs.paymentMethod} onChange={handleChange} required>
            <option value="">-- Select Payment --</option>
            <option value="Card">Credit / Debit Card</option>
            <option value="Bank">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>

          <div className="cost-display">
            <strong>Estimated Costs:</strong> {cost > 0 ? `LKR ${cost}` : "Select type, quantity, and dates"}
          </div>

          <button type="submit" className="submit-btn">Book Now</button>
        </form>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} D&S Creations. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LedBoard;
