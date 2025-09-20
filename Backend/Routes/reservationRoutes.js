const express = require("express");
const router = express.Router();
const {
    createReservation,
    getAllReservations,
    getReservationById,
    getReservationByReservationId,
    updateReservationStatus,
    getReservationsByCustomer,
    getReservationStats
} = require("../controllers/reservationController");

// @route   GET /api/reservations/stats
// @desc    Get reservation statistics
// @access  Public
router.get("/stats", getReservationStats);

// @route   GET /api/reservations
// @desc    Get all reservations with pagination and filters
// @access  Public
router.get("/", getAllReservations);

// @route   GET /api/reservations/customer/:email
// @desc    Get reservations by customer email
// @access  Public
router.get("/customer/:email", getReservationsByCustomer);

// @route   GET /api/reservations/lookup/:reservationId
// @desc    Get reservation by reservation ID
// @access  Public
router.get("/lookup/:reservationId", getReservationByReservationId);

// @route   GET /api/reservations/:id
// @desc    Get single reservation by ID
// @access  Public
router.get("/:id", getReservationById);

// @route   POST /api/reservations
// @desc    Create new reservation
// @access  Public
router.post("/", createReservation);

// @route   PUT /api/reservations/:id/status
// @desc    Update reservation status
// @access  Public
router.put("/:id/status", updateReservationStatus);

module.exports = router;
