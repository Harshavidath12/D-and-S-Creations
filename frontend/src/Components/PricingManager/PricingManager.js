import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
//import styles from "./PricingManager.module.css";
import styles from "./PricingManager.module.css"

// Debugging: Check loaded CSS
console.log("Loaded styles:", styles);

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

  // Handle input changes
  const handleChange = (e, index, field) => {
    const updatedPricing = [...pricing];
    updatedPricing[index][field] = e.target.value;
    setPricing(updatedPricing);
  };

  // Save updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let item of pricing) {
        await axios.put(`http://localhost:5000/pricing/${item._id}`, {
          dailyRate: item.dailyRate,
          hourlyRate: item.hourlyRate,
        });
      }
      alert("✅ Pricing updated successfully!");
      fetchPricing();
    } catch (err) {
      console.error("Error updating pricing:", err);
      alert("❌ Failed to update pricing.");
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles.pmWrapper}>
        <h1 className={styles.pmTitle}>💡 LED Boards Price Management</h1>

        <form className={styles.pmForm} onSubmit={handleSubmit}>
          <div className={styles.pmGrid}>
            {pricing.map((item, index) => (
              <div className={styles.pmCard} key={item._id}>
                <h2 className={styles.pmBoardTitle}>{item.boardType}</h2>

                <div className={styles.pmRateGroup}>
                  <label>Daily Rate (LKR)</label>
                  <input
                    type="number"
                    value={item.dailyRate}
                    onChange={(e) => handleChange(e, index, "dailyRate")}
                  />
                </div>

                <div className={styles.pmRateGroup}>
                  <label>Extra Hour Rate (LKR)</label>
                  <input
                    type="number"
                    value={item.hourlyRate}
                    onChange={(e) => handleChange(e, index, "hourlyRate")}
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className={styles.pmSaveBtn}>
            💾 Save All Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PricingManager;
