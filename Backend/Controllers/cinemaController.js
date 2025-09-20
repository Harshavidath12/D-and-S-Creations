const Cinema = require("../models/Cinema");

// @desc    Get all cinemas
// @route   GET /api/cinemas
// @access  Public
const getAllCinemas = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, is_active } = req.query;
        
        // Build filter object
        const filter = {};
        if (search) {
            filter.$or = [
                { cinema_name: { $regex: search, $options: 'i' } },
                { cinema_location: { $regex: search, $options: 'i' } }
            ];
        }
        if (is_active !== undefined) {
            filter.is_active = is_active === 'true';
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get cinemas with pagination
        const cinemas = await Cinema.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Cinema.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: cinemas.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: cinemas
        });

    } catch (error) {
        console.error("Error fetching cinemas:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Get single cinema
// @route   GET /api/cinemas/:id
// @access  Public
const getCinemaById = async (req, res) => {
    try {
        const cinema = await Cinema.findById(req.params.id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found"
            });
        }

        res.status(200).json({
            success: true,
            data: cinema
        });

    } catch (error) {
        console.error("Error fetching cinema:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid cinema ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Create new cinema
// @route   POST /api/cinemas
// @access  Public
const createCinema = async (req, res) => {
    try {
        const {
            cinema_name,
            cinema_location,
            ongoing_movies,
            upcoming_movie,
            contact_info
        } = req.body;

        // Validate required fields
        if (!cinema_name || !cinema_location || !ongoing_movies || !upcoming_movie) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                required_fields: ["cinema_name", "cinema_location", "ongoing_movies", "upcoming_movie"]
            });
        }

        // Check if cinema already exists
        const existingCinema = await Cinema.findOne({
            cinema_name: cinema_name,
            cinema_location: cinema_location
        });

        if (existingCinema) {
            return res.status(409).json({
                success: false,
                message: "Cinema with this name and location already exists"
            });
        }

        const cinema = new Cinema({
            cinema_name,
            cinema_location,
            ongoing_movies,
            upcoming_movie,
            contact_info
        });

        const savedCinema = await cinema.save();

        console.log("✅ Successfully created new cinema:", {
            id: savedCinema._id,
            name: savedCinema.cinema_name,
            location: savedCinema.cinema_location,
            timestamp: new Date().toISOString()
        });

        res.status(201).json({
            success: true,
            message: "Cinema created successfully",
            data: savedCinema
        });

    } catch (error) {
        console.error("❌ Error creating cinema:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Update cinema
// @route   PUT /api/cinemas/:id
// @access  Public
const updateCinema = async (req, res) => {
    try {
        const cinema = await Cinema.findById(req.params.id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found"
            });
        }

        // Update fields
        const {
            cinema_name,
            cinema_location,
            ongoing_movies,
            upcoming_movie,
            contact_info,
            is_active
        } = req.body;

        if (cinema_name) cinema.cinema_name = cinema_name;
        if (cinema_location) cinema.cinema_location = cinema_location;
        if (ongoing_movies) cinema.ongoing_movies = { ...cinema.ongoing_movies, ...ongoing_movies };
        if (upcoming_movie) cinema.upcoming_movie = upcoming_movie;
        if (contact_info) cinema.contact_info = { ...cinema.contact_info, ...contact_info };
        if (is_active !== undefined) cinema.is_active = is_active;

        const updatedCinema = await cinema.save();

        console.log("✅ Successfully updated cinema:", {
            id: updatedCinema._id,
            name: updatedCinema.cinema_name,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: "Cinema updated successfully",
            data: updatedCinema
        });

    } catch (error) {
        console.error("❌ Error updating cinema:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid cinema ID format"
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Delete cinema
// @route   DELETE /api/cinemas/:id
// @access  Public
const deleteCinema = async (req, res) => {
    try {
        const cinema = await Cinema.findById(req.params.id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found"
            });
        }

        await Cinema.findByIdAndDelete(req.params.id);

        console.log("✅ Successfully deleted cinema:", {
            id: cinema._id,
            name: cinema.cinema_name,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: "Cinema deleted successfully",
            data: {
                id: cinema._id,
                name: cinema.cinema_name
            }
        });

    } catch (error) {
        console.error("❌ Error deleting cinema:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid cinema ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// @desc    Get cinema statistics
// @route   GET /api/cinemas/stats
// @access  Public
const getCinemaStats = async (req, res) => {
    try {
        const totalCinemas = await Cinema.countDocuments();
        const activeCinemas = await Cinema.countDocuments({ is_active: true });
        const inactiveCinemas = totalCinemas - activeCinemas;

        // Get recent cinemas (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCinemas = await Cinema.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                total: totalCinemas,
                active: activeCinemas,
                inactive: inactiveCinemas,
                recent: recentCinemas
            }
        });

    } catch (error) {
        console.error("Error fetching cinema stats:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    getAllCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    deleteCinema,
    getCinemaStats
};