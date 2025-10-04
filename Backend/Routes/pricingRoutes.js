// Routes/pricingRoutes.js
const express = require("express");
const router = express.Router();
const PricingController = require("../Controllers/PricingCcontroller");

// CRUD Routes
router.get("/", PricingController.getAllPrices);       // Get all
router.post("/", PricingController.addPrice);          // Add new
router.get("/:id", PricingController.getById);         // Get by ID
router.put("/:id", PricingController.updatePrice);     // Update
router.delete("/:id", PricingController.deletePrice);  // Delete

module.exports = router;
