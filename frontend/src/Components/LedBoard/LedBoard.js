import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./LedBoard.css";
import axios from "axios";
import User from "../User/User";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function LedBoard() {
  const location = useLocation(); // Detect route changes
  const history = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    ledBoardType: "",
    quantity: "",
    location: "",
    purpose: "",
    rentalStartDateTime: "",
    rentalEndDateTime: "",
    paymentMethod: "",
  });

  // ✅ New state for dynamic pricing
  const [pricing, setPricing] = useState({});

  // ✅ Fetch pricing data from backend when component loads
 useEffect(() => {
  const fetchPricing = async () => {
    try {
      const res = await axios.get("http://localhost:5000/pricing");
      setPricing(res.data);
    } catch (err) {
      console.error("Error fetching pricing:", err);
    }
  };
  fetchPricing();
}, []);


  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs); // After user clicks submit to which page to be navigated
    sendRequest().then(() => history("/userdetails"));
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:5000/users", {
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

  // Initial state
  const [formData, setFormData] = useState({
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

  // Calculate rental cost dynamically using fetched pricing
 const calculateCost = () => {
  if (!inputs.ledBoardType || !inputs.rentalStartDateTime || !inputs.rentalEndDateTime) return;

  const start = new Date(inputs.rentalStartDateTime);
  const end = new Date(inputs.rentalEndDateTime);

  // Invalid dates
  if (end <= start) {
    setCost(0);
    return;
  }

  const diffMs = end - start;
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // total hours

  const days = Math.floor(diffHours / 24); // full days
  const extraHours = diffHours % 24;       // remaining hours

  const boardPricing = pricing[inputs.ledBoardType];
  if (!boardPricing) return;

  const { daily, extraHour } = boardPricing;

  let totalCost = 0;

  if (diffHours < 24) {
    // Less than 24 hours → charge only extra hours
    totalCost = diffHours * extraHour;
  } else {
    // 24 hours or more → charge full days + extra hours
    totalCost = (days * daily) + (extraHours * extraHour);
  }

  // Multiply by quantity
  totalCost *= parseInt(inputs.quantity) || 1;

  setCost(totalCost);
};


  // Update cost live when form data changes
  useEffect(() => {
    calculateCost();
    // eslint-disable-next-line
  }, [inputs.ledBoardType, inputs.quantity, inputs.rentalStartDateTime, inputs.rentalEndDateTime, pricing]);

  return (
    <div>
      {/* Navbar */}
      <Nav />

      {/* ✅ LED Board Categories Section */}
      <div>
        {ledboards &&
          ledboards.map((ledboard, i) => (
            <div key={i}>
              <User ledboard={ledboard} />
            </div>
          ))}
      </div>

      <div className="ledboard-categories">
        <h2>LED Board Categories</h2>
        <div className="categories-grid">
          <div className="category-card">
            <img src="/images/outdoor-led.jpg" alt="Outdoor LED" />
            <h3>Outdoor LED Board</h3>
            <p>
              LKR {pricing.Outdoor?.daily || 50000} per day + LKR{" "}
              {pricing.Outdoor?.extraHour || 1000} per extra hour
            </p>
          </div>
          <div className="category-card">
            <img src="/images/indoor-led.jpg" alt="Indoor LED" />
            <h3>Indoor LED Board</h3>
            <p>
              LKR {pricing.Indoor?.daily || 24000} per day + LKR{" "}
              {pricing.Indoor?.extraHour || 1000} per extra hour
            </p>
          </div>
          <div className="category-card">
            <img src="/images/p6-led.jpg" alt="P3 LED" />
            <h3>P3 LED Board</h3>
            <p>
              LKR {pricing.P3?.daily || 12000} per day + LKR{" "}
              {pricing.P3?.extraHour || 1000} per extra hour
            </p>
          </div>
          <div className="category-card">
            <img src="/images/p6-led.jpg" alt="P6 LED" />
            <h3>P6 LED Board</h3>
            <p>
              LKR {pricing.P6?.daily || 6000} per day + LKR{" "}
              {pricing.P6?.extraHour || 1000} per extra hour
            </p>
          </div>
        </div>
      </div>

      <div className="ledboard-container">
        <h1>Rent an LED Board</h1>
        <p className="intro-text">
          Rent high-quality LED boards for school events, university functions,
          hotels, weddings, concerts, conferences, and more.
        </p>

        {/* Rental Form */}
        <form className="ledboard-form" onSubmit={handleSubmit}>
          {/* Name */}
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Full name"
            value={inputs.name}
            onChange={handleChange}
            required
          />

          {/* Type of LED Board */}
          <label>Type of LED Board</label>
          <select
            name="ledBoardType"
            value={inputs.ledBoardType}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Outdoor">Outdoor LED Board</option>
            <option value="Indoor">Indoor LED Board</option>
            <option value="P3">P3 LED Board</option>
            <option value="P6">P6 LED Board</option>
          </select>

          {/* Quantity */}
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={inputs.quantity}
            onChange={handleChange}
            required
          />

          {/* Location */}
          <label>Location (Venue, City, Address)</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={inputs.location}
            onChange={handleChange}
            required
          />

          {/* Purpose */}
          <label>Purpose</label>
          <select
            name="purpose"
            value={inputs.purpose}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Purpose --</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Wedding">Wedding</option>
            <option value="Concert">Concert</option>
            <option value="Conference">Conference</option>
            <option value="School Event">School Event</option>
            <option value="University Event">University Event</option>
          </select>

          {/* Rental Dates */}
          <label>Rental Start Date & Time</label>
          <input
            type="datetime-local"
            name="rentalStartDateTime"
            value={inputs.rentalStartDateTime}
            onChange={handleChange}
            required
          />

          <label>Rental End Date & Time</label>
          <input
            type="datetime-local"
            name="rentalEndDateTime"
            value={inputs.rentalEndDateTime}
            onChange={handleChange}
            required
          />

          {/* Payment */}
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={inputs.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Payment --</option>
            <option value="Card">Credit / Debit Card</option>
            <option value="Bank">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>

          {/* Cost Display */}
          <div className="cost-display">
            <strong>Estimated Cost:</strong>{" "}
            {cost > 0 ? `LKR ${cost}` : "Select type, quantity, and dates"}
          </div>

          <button type="submit" className="submit-btn">
            Book Now
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} D&S Creations. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LedBoard;
