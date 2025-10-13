const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");


// Import model and controller
const Led = require("../Model/LedModel");

const LedController = require("../Controllers/LedController");

// ✅ CRUD routes for LED boards
router.get("/", LedController.getAllLedBoards);       // Get all LED board records
router.post("/", LedController.addLedBoard);          // Add new LED board record
router.get("/:id", LedController.getLedBoardById);    // Get LED board record by ID
router.put("/:id", LedController.updateLedBoard);     // Update LED board record by ID
router.get("/ownerId/:ownerId", LedController.getLedBoardByUsername); // Get LED board record by ownerId

module.exports = router;
