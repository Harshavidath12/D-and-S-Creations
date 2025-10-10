const express = require("express");
const router = express.Router();
const {
    getAllCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    deleteCinema,
    getCinemaStats,
    updateSlotPrices,
    updateMovieSlotPrices
} = require("../Controllers/cinemaController");

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

// @route   PUT /api/cinemas/:id/slot-prices
// @desc    Update advertisement slot prices
// @access  Public
router.put("/:id/slot-prices", updateSlotPrices);

// @route   PUT /api/cinemas/:id/movie-slot-prices
// @desc    Update movie-wise slot pricing
// @access  Public
router.put("/:id/movie-slot-prices", updateMovieSlotPrices);

module.exports = router;