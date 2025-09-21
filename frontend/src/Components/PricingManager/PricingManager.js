import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "./PricingManager.css";

const PricingManager = () => {
  const [pricing, setPricing] = useState({
    Outdoor: { daily: 0, extraHour: 0 },
    Indoor: { daily: 0, extraHour: 0 },
    P3: { daily: 0, extraHour: 0 },
    P6: { daily: 0, extraHour: 0 },
  });

  // Fetch current pricing
  const fetchPricing = async () => {
    const res = await axios.get("http://localhost:5000/pricing");
    setPricing(res.data);
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  // Handle price updates
  const handleChange = (e, boardType, field) => {
    setPricing({
      ...pricing,
      [boardType]: {
        ...pricing[boardType],
        [field]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put("http://localhost:5000/pricing", pricing);
    alert("Pricing updated successfully!");
  };

  return (
    <div>
      <Nav />
      <div className="pricing-container">
        <h1>LED Boards Pricing Management</h1>
        <form onSubmit={handleSubmit}>
          {Object.keys(pricing).map((type) => (
            <div className="pricing-card" key={type}>
              <h2>{type} LED Board</h2>
              <label>Daily Rate (LKR)</label>
              <input
                type="number"
                value={pricing[type].daily}
                onChange={(e) => handleChange(e, type, "daily")}
              />
              <label>Extra Hour Rate (LKR)</label>
              <input
                type="number"
                value={pricing[type].extraHour}
                onChange={(e) => handleChange(e, type, "extraHour")}
              />
            </div>
          ))}
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default PricingManager;
