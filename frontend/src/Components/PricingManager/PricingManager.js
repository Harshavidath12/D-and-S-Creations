import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "./PricingManager.css";

const PricingManager = () => {
  const [pricing, setPricing] = useState([]);

  // Fetch current pricing
  const fetchPricing = async () => {
    try {
      const res = await axios.get("http://localhost:5000/pricing");
      setPricing(res.data);
    } catch (err) {
      console.error("Error fetching pricing:", err);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  // Handle field change
  const handleChange = (e, index, field) => {
    const updated = [...pricing];
    updated[index][field] = e.target.value;
    setPricing(updated);
  };

  // Save updates to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let item of pricing) {
        await axios.put(`http://localhost:5000/pricing/${item._id}`, {
          dailyRate: item.dailyRate,
          hourlyRate: item.hourlyRate,
        });
      }
      alert("Pricing updated successfully!");
      fetchPricing(); // refresh
    } catch (err) {
      console.error("Error updating pricing:", err);
      alert("Failed to update pricing.");
    }
  };

  return (
    <div>
      <Nav />
      <div className="pricing-container">
        <h1>LED Boards Pricing Management</h1>
        <form onSubmit={handleSubmit}>
          {pricing.map((item, index) => (
            <div className="pricing-card" key={item._id}>
              <h2>{item.boardType}</h2>
              <label>Daily Rate (LKR)</label>
              <input
                type="number"
                value={item.dailyRate}
                onChange={(e) => handleChange(e, index, "dailyRate")}
              />
              <label>Extra Hour Rate (LKR)</label>
              <input
                type="number"
                value={item.hourlyRate}
                onChange={(e) => handleChange(e, index, "hourlyRate")}
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
