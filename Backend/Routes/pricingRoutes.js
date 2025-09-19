// routes/pricingRoutes.js
const express = require('express');
const router = express.Router();

let pricing = {
  Outdoor: { daily: 50000, extraHour: 1000 },//pricing calculation
  Indoor: { daily: 24000, extraHour: 1000 },
  P3: { daily: 12000, extraHour: 1000 },
  P6: { daily: 6000, extraHour: 1000 },
};

// GET current pricing
router.get("/", (req, res) => {
  res.json(pricing);
});

// UPDATED pricing
router.put("/", (req, res) => {
  pricing = req.body;
  res.json({ message: "Pricing updated successfully!", pricing });
});

module.exports = router;
