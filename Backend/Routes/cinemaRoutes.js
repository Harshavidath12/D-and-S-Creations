const express = require("express");
const router = express.Router();
const {
    getAllCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    deleteCinema,
    getCinemaStats
} = require("../controllers/cinemaController");

// @route   GET /api/cinemas/stats
// @desc    Get cinema statistics
// @access  Public
router.get("/stats", getCinemaStats);

// @route   GET /api/cinemas
// @desc    Get all cinemas with pagination and search
// @access  Public
router.get("/", getAllCinemas);

// @route   GET /api/cinemas/:id
// @desc    Get single cinema by ID
// @access  Public
router.get("/:id", getCinemaById);

// @route   POST /api/cinemas
// @desc    Create new cinema
// @access  Public
router.post("/", createCinema);

// @route   PUT /api/cinemas/:id
// @desc    Update cinema by ID
// @access  Public
router.put("/:id", updateCinema);

// @route   DELETE /api/cinemas/:id
// @desc    Delete cinema by ID
// @access  Public
router.delete("/:id", deleteCinema);

module.exports = router;