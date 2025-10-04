import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./LedBoard.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const USERS_URL = "http://localhost:5000/bookings";   // Rentals/Bookings
const STOCK_URL = "http://localhost:5000/stock";      // Inventory
const PRICING_URL = "http://localhost:5000/pricing";

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
  const [pricing, setPricing] = useState({});
  const [stock, setStock] = useState([]); // ✅ inventory, not rentals
  const [error, setError] = useState(""); // ✅ runtime validation error

  // ✅ Fetch pricing from backend
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

  // ✅ Fetch stock inventory
  useEffect(() => {
    axios
      .get(STOCK_URL)
      .then((res) => setStock(res.data.stock || []))
      .catch((err) => console.error("Error fetching stock:", err));
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

    // ✅ Runtime validation for rental dates
    const start = new Date(inputs.rentalStartDateTime);
    const end = new Date(inputs.rentalEndDateTime);
    if (end <= start) {
      setError("⚠️ Rental end date & time must be after the start date & time.");
      return;
    }
    setError(""); // clear error

    try {
      await axios.post(USERS_URL, { ...inputs });
      const bookingDetails = { ...inputs, cost };
      history("/payment", { state: bookingDetails });
    } catch (err) {
      console.error("Error submitting booking:", err);
    }
  };

  // ✅ Calculate estimated cost
  const calculateCost = () => {
    const { ledBoardType, rentalStartDateTime, rentalEndDateTime, quantity } =
      inputs;
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
      totalCost =
        days * boardPricing.daily + extraHours * boardPricing.extraHour;
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

      <div className="ledboard-categories">
        <h2>LED Boards Categories</h2>
        <div className="categories-grid">
          {Object.keys(pricing).map((boardType) => (
            <div className="category-card" key={boardType}>
              <img
                src={`/images/${boardType.toLowerCase().replace(/\s+/g, "-")}-led-board.jpg`}
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
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            required
            autoComplete="off"
          />

          <label>Type of LED Board</label>
          <select
            name="ledBoardType"
            value={inputs.ledBoardType}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Type --</option>
            {[...new Set(stock.map((s) => s.boardType))].map((boardType) => {
              const availableStock = stock.filter(
                (b) => b.boardType === boardType && b.status === "Available"
              );

              if (availableStock.length > 0) {
                // Show available with count
                return (
                  <option key={boardType} value={boardType}>
                    {boardType} ({availableStock.length} Available)
                  </option>
                );
              } else {
                // Show as unavailable (disabled)
                return (
                  <option key={boardType} value="" disabled>
                    {boardType} (Currently unavailable)
                  </option>
                );
              }
            })}
          </select>

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={inputs.quantity}
            onChange={handleChange}
            autoComplete="off"         // disables autofill
            required
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={inputs.location}
            onChange={handleChange}
            required
            autoComplete="off"
          />

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

          <label>Rental Start Date & Time</label>
          <input
            type="datetime-local"
            name="rentalStartDateTime"
            value={inputs.rentalStartDateTime}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)}  // prevent past dates
          />

          <label>Rental End Date & Time</label>
          <input
            type="datetime-local"
            name="rentalEndDateTime"
            value={inputs.rentalEndDateTime}
            onChange={handleChange}
            required
            min={inputs.rentalStartDateTime || new Date().toISOString().slice(0, 16)}
          />

          {error && <p className="error-text">{error}</p>}

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

          <div className="cost-display">
            <strong>Estimated Costs:</strong>{" "}
            {cost > 0 ? `LKR ${cost}` : "Select type, quantity, and dates"}
          </div>

          <button type="submit" className="submit-btn">
            Book Now
          </button>
        </form>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} D&S Creations. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LedBoard;
