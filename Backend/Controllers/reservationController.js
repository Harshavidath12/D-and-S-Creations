const Reservation = require("../models/Reservation");
const Cinema = require("../models/Cinema");

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Public
const createReservation = async (req, res) => {
    try {
        console.log("📥 Received reservation data:", JSON.stringify(req.body, null, 2));
        
        const {
            cinema_id,
            movie_name,
            movie_key,
            show_date,
            show_time,
            advertisement_slots,
            advertisement_duration,
            customer_name,
            customer_email,
            customer_phone,
            company_name,
            notes
        } = req.body;

        // Validate required fields
        if (!cinema_id || !movie_name || !movie_key || !show_date || !show_time || 
            !advertisement_slots || !advertisement_duration || !customer_name || 
            !customer_email || !customer_phone || !company_name) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                required_fields: [
                    "cinema_id", "movie_name", "movie_key", "show_date", "show_time",
                    "advertisement_slots", "advertisement_duration", "customer_name",
                    "customer_email", "customer_phone", "company_name"
                ]
            });
        }

        // Validate movie_key
        if (!['movie_1', 'movie_2', 'movie_3', 'movie_4'].includes(movie_key)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie key. Must be 'movie_1', 'movie_2', 'movie_3', or 'movie_4'"
            });
        }

        // Validate advertisement duration
        if (advertisement_duration < 15 || advertisement_duration > 120) {
            return res.status(400).json({
                success: false,
                message: "Advertisement duration must be between 15 and 120 seconds"
            });
        }

        // Validate advertisement slots
        if (!Array.isArray(advertisement_slots) || advertisement_slots.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one advertisement slot must be selected"
            });
        }

        // Get cinema details
        const cinema = await Cinema.findById(cinema_id);
        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found"
            });
        }

        // Check if cinema is active
        if (!cinema.is_active) {
            return res.status(400).json({
                success: false,
                message: "Cinema is not active for reservations"
            });
        }

        // Validate movie exists in cinema
        const movieExists = cinema.ongoing_movies[movie_key] && cinema.ongoing_movies[movie_key].name;
        if (!movieExists) {
            return res.status(400).json({
                success: false,
                message: "Selected movie is not available in this cinema"
            });
        }

        // Check if slots are available and calculate total amount
        let totalAmount = 0;
        const moviePricing = cinema.movie_slot_pricing[movie_key];
        
        if (!moviePricing || !moviePricing.slots) {
            return res.status(400).json({
                success: false,
                message: "Movie slot pricing not available"
            });
        }

        // Validate each selected slot
        for (const selectedSlot of advertisement_slots) {
            const { slot_type, slot_number } = selectedSlot;
            
            // Find the slot in cinema pricing
            const cinemaSlot = moviePricing.slots.find(slot => 
                slot.slot_type === slot_type && slot.slot_number === slot_number
            );
            
            if (!cinemaSlot) {
                return res.status(400).json({
                    success: false,
                    message: `Slot ${slot_number} of type ${slot_type} not found for this movie`
                });
            }
            
            if (cinemaSlot.is_reserved) {
                return res.status(400).json({
                    success: false,
                    message: `Slot ${slot_number} of type ${slot_type} is already reserved`
                });
            }
            
            totalAmount += cinemaSlot.price;
        }

        // Create reservation
        const reservation = new Reservation({
            cinema_id,
            cinema_name: cinema.cinema_name,
            cinema_location: cinema.cinema_location,
            movie_name,
            movie_key,
            show_date: new Date(show_date),
            show_time,
            advertisement_slots: advertisement_slots.map(slot => ({
                slot_id: `${slot.slot_type}_${slot.slot_number}`,
                slot_type: slot.slot_type,
                slot_number: slot.slot_number,
                price: slot.price
            })),
            advertisement_duration,
            customer_name,
            customer_email,
            customer_phone,
            company_name,
            total_amount: totalAmount,
            notes
        });

        const savedReservation = await reservation.save();

        // Update cinema slots to mark them as reserved
        for (const selectedSlot of advertisement_slots) {
            const { slot_type, slot_number } = selectedSlot;
            const cinemaSlot = moviePricing.slots.find(slot => 
                slot.slot_type === slot_type && slot.slot_number === slot_number
            );
            
            if (cinemaSlot) {
                cinemaSlot.is_reserved = true;
                cinemaSlot.reserved_by = customer_name;
                cinemaSlot.reserved_at = new Date();
            }
        }

        await cinema.save();

        console.log("✅ Successfully created reservation:", {
            reservation_id: savedReservation.reservation_id,
            customer: customer_name,
            cinema: cinema.cinema_name,
            movie: movie_name,
            total_amount: totalAmount,
            timestamp: new Date().toISOString()
        });

        res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            data: savedReservation
        });

    } catch (error) {
        console.error("❌ Error creating reservation:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Reservation ID already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Public
const getAllReservations = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, customer_email, cinema_id } = req.query;
        
        // Build filter object
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (customer_email) {
            filter.customer_email = customer_email;
        }
        if (cinema_id) {
            filter.cinema_id = cinema_id;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get reservations with pagination
        const reservations = await Reservation.find(filter)
            .populate('cinema_id', 'cinema_name cinema_location')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Reservation.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: reservations.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: reservations
        });

    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Get reservation by ID
// @route   GET /api/reservations/:id
// @access  Public
const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('cinema_id', 'cinema_name cinema_location contact_info');

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });

    } catch (error) {
        console.error("Error fetching reservation:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid reservation ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Get reservation by reservation ID
// @route   GET /api/reservations/lookup/:reservationId
// @access  Public
const getReservationByReservationId = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({ reservation_id: req.params.reservationId })
            .populate('cinema_id', 'cinema_name cinema_location contact_info');

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });

    } catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Public
const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'pending', 'confirmed', 'cancelled', or 'completed'"
            });
        }

        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        // Update status and relevant timestamps
        reservation.status = status;
        if (status === 'confirmed') {
            reservation.confirmed_at = new Date();
        } else if (status === 'cancelled') {
            reservation.cancelled_at = new Date();
        }

        const updatedReservation = await reservation.save();

        // If cancelling, free up the slots
        if (status === 'cancelled') {
            const cinema = await Cinema.findById(reservation.cinema_id);
            if (cinema && cinema.movie_slot_pricing[reservation.movie_key]) {
                const moviePricing = cinema.movie_slot_pricing[reservation.movie_key];
                
                for (const slot of reservation.advertisement_slots) {
                    const cinemaSlot = moviePricing.slots.find(s => 
                        s.slot_type === slot.slot_type && s.slot_number === slot.slot_number
                    );
                    
                    if (cinemaSlot) {
                        cinemaSlot.is_reserved = false;
                        cinemaSlot.reserved_by = "";
                        cinemaSlot.reserved_at = null;
                    }
                }
                
                await cinema.save();
            }
        }

        console.log("✅ Successfully updated reservation status:", {
            reservation_id: updatedReservation.reservation_id,
            new_status: status,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: "Reservation status updated successfully",
            data: updatedReservation
        });

    } catch (error) {
        console.error("❌ Error updating reservation status:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid reservation ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Get reservations by customer email
// @route   GET /api/reservations/customer/:email
// @access  Public
const getReservationsByCustomer = async (req, res) => {
    try {
        const { email } = req.params;
        const { status } = req.query;
        
        const filter = { customer_email: email };
        if (status) {
            filter.status = status;
        }

        const reservations = await Reservation.find(filter)
            .populate('cinema_id', 'cinema_name cinema_location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });

    } catch (error) {
        console.error("Error fetching customer reservations:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Get reservation statistics
// @route   GET /api/reservations/stats
// @access  Public
const getReservationStats = async (req, res) => {
    try {
        const totalReservations = await Reservation.countDocuments();
        const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
        const confirmedReservations = await Reservation.countDocuments({ status: 'confirmed' });
        const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });
        const completedReservations = await Reservation.countDocuments({ status: 'completed' });

        // Get total revenue
        const revenueResult = await Reservation.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: null, total: { $sum: '$total_amount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get recent reservations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentReservations = await Reservation.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                total: totalReservations,
                pending: pendingReservations,
                confirmed: confirmedReservations,
                cancelled: cancelledReservations,
                completed: completedReservations,
                revenue: totalRevenue,
                recent: recentReservations
            }
        });

    } catch (error) {
        console.error("Error fetching reservation stats:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    createReservation,
    getAllReservations,
    getReservationById,
    getReservationByReservationId,
    updateReservationStatus,
    getReservationsByCustomer,
    getReservationStats
};
