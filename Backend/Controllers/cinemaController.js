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
        console.log("📥 Received cinema data:", JSON.stringify(req.body, null, 2));
        console.log("📥 Movie slot pricing data:", JSON.stringify(req.body.movie_slot_pricing, null, 2));
        
        const {
            cinema_name,
            cinema_location,
            ongoing_movies,
            upcoming_movies,
            google_maps_location,
            contact_info,
            movie_slot_pricing,
            is_active
        } = req.body;

        // Validate required fields
        if (!cinema_name || !cinema_location || !ongoing_movies) {
            console.log("❌ Missing required fields:", {
                cinema_name: !!cinema_name,
                cinema_location: !!cinema_location,
                ongoing_movies: !!ongoing_movies,
                upcoming_movies: !!upcoming_movies
            });
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                required_fields: ["cinema_name", "cinema_location", "ongoing_movies"],
                received: {
                    cinema_name: !!cinema_name,
                    cinema_location: !!cinema_location,
                    ongoing_movies: !!ongoing_movies,
                    upcoming_movies: !!upcoming_movies
                }
            });
        }

        // Validate movie slot pricing if provided
        if (movie_slot_pricing) {
            const movies = ['movie_1', 'movie_2', 'movie_3', 'movie_4'];
            for (const movieKey of movies) {
                const movie = movie_slot_pricing[movieKey];
                if (movie) {
                    // Check if any price is negative (only if provided)
                    if (movie.starting_price !== undefined && movie.starting_price < 0) {
                        return res.status(400).json({
                            success: false,
                            message: `Starting price cannot be negative for ${movieKey}`,
                            received: {
                                starting_price: movie.starting_price
                            }
                        });
                    }
                    if (movie.interval_price !== undefined && movie.interval_price < 0) {
                        return res.status(400).json({
                            success: false,
                            message: `Interval price cannot be negative for ${movieKey}`,
                            received: {
                                interval_price: movie.interval_price
                            }
                        });
                    }
                    if (movie.ending_price !== undefined && movie.ending_price < 0) {
                        return res.status(400).json({
                            success: false,
                            message: `Ending price cannot be negative for ${movieKey}`,
                            received: {
                                ending_price: movie.ending_price
                            }
                        });
                    }
                }
            }
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

        // Provide default upcoming_movies if not provided
        const defaultUpcomingMovies = {
            movie_1: { name: "", trailer_link: "" },
            movie_2: { name: "", trailer_link: "" }
        };

        // Process movie slot pricing to ensure it has the correct structure
        let processedMovieSlotPricing = movie_slot_pricing;
        if (movie_slot_pricing) {
            console.log("🔧 Processing movie slot pricing in controller:", JSON.stringify(movie_slot_pricing, null, 2));
            processedMovieSlotPricing = {};
            const movies = ['movie_1', 'movie_2', 'movie_3', 'movie_4'];
            
            movies.forEach(movieKey => {
                const movie = movie_slot_pricing[movieKey];
                if (movie) {
                    console.log(`🔧 Processing ${movieKey}:`, JSON.stringify(movie, null, 2));
                    processedMovieSlotPricing[movieKey] = {
                        starting_price: movie.starting_price || 0,
                        interval_price: movie.interval_price || 0,
                        ending_price: movie.ending_price || 0,
                        slots: [] // Will be populated by middleware
                    };
                    console.log(`✅ Processed ${movieKey}:`, JSON.stringify(processedMovieSlotPricing[movieKey], null, 2));
                }
            });
            console.log("🔧 Final processed pricing:", JSON.stringify(processedMovieSlotPricing, null, 2));
        }


        console.log("🔧 Creating Cinema with processed pricing:", JSON.stringify(processedMovieSlotPricing, null, 2));
        
        const cinema = new Cinema({
            cinema_name,
            cinema_location,
            ongoing_movies,
            upcoming_movies: upcoming_movies || defaultUpcomingMovies,
            google_maps_location,
            contact_info,
            movie_slot_pricing: processedMovieSlotPricing,
            is_active: is_active !== undefined ? is_active : true
        });
        
        console.log("🔧 Cinema object before save:", JSON.stringify(cinema.movie_slot_pricing, null, 2));

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
            upcoming_movies,
            google_maps_location,
            contact_info,
            movie_slot_pricing,
            is_active
        } = req.body;

        if (cinema_name) cinema.cinema_name = cinema_name;
        if (cinema_location) cinema.cinema_location = cinema_location;
        if (ongoing_movies) cinema.ongoing_movies = { ...cinema.ongoing_movies, ...ongoing_movies };
        if (upcoming_movies) cinema.upcoming_movies = { ...cinema.upcoming_movies, ...upcoming_movies };
        if (google_maps_location !== undefined) cinema.google_maps_location = google_maps_location;
        if (contact_info) cinema.contact_info = { ...cinema.contact_info, ...contact_info };
        if (movie_slot_pricing) cinema.movie_slot_pricing = movie_slot_pricing;
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

// @desc    Update advertisement slot prices
// @route   PUT /api/cinemas/:id/slot-prices
// @access  Public
const updateSlotPrices = async (req, res) => {
    try {
        const cinema = await Cinema.findById(req.params.id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found"
            });
        }

        const { slotType, slotNumber, price } = req.body;

        if (!slotType || !slotNumber || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: slotType, slotNumber, price"
            });
        }

        if (!['start_slots', 'interval_slots', 'end_slots'].includes(slotType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid slot type. Must be 'start_slots', 'interval_slots', or 'end_slots'"
            });
        }

        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        // Find and update the specific slot
        const slot = cinema.advertisement_slots[slotType].find(s => s.slot_number === slotNumber);
        if (!slot) {
            return res.status(404).json({
                success: false,
                message: `Slot ${slotNumber} not found in ${slotType}`
            });
        }

        slot.price = price;
        await cinema.save();

        console.log("✅ Successfully updated slot price:", {
            cinemaId: cinema._id,
            slotType,
            slotNumber,
            newPrice: price,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: "Slot price updated successfully",
            data: {
                slotType,
                slotNumber,
                price
            }
        });

    } catch (error) {
        console.error("❌ Error updating slot price:", error);
        
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

// @desc    Update movie-wise slot pricing
// @route   PUT /api/cinemas/:id/movie-slot-prices
// @access  Public
const updateMovieSlotPrices = async (req, res) => {
    try {
        const cinema = await Cinema.findById(req.params.id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Cinema not found"
            });
        }

        const { movie_key, starting_price, interval_price, ending_price } = req.body;

        if (!movie_key) {
            return res.status(400).json({
                success: false,
                message: "Movie key is required"
            });
        }

        if (!['movie_1', 'movie_2', 'movie_3', 'movie_4'].includes(movie_key)) {
            return res.status(400).json({
                success: false,
                message: "Invalid movie key. Must be 'movie_1', 'movie_2', 'movie_3', or 'movie_4'"
            });
        }

        // Update the specific movie's slot pricing
        if (starting_price !== undefined) {
            if (starting_price < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Starting price cannot be negative"
                });
            }
            cinema.movie_slot_pricing[movie_key].starting_price = starting_price;
        }
        if (interval_price !== undefined) {
            if (interval_price < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Interval price cannot be negative"
                });
            }
            cinema.movie_slot_pricing[movie_key].interval_price = interval_price;
        }
        if (ending_price !== undefined) {
            if (ending_price < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Ending price cannot be negative"
                });
            }
            cinema.movie_slot_pricing[movie_key].ending_price = ending_price;
        }

        // Regenerate slots with new prices
        const movie = cinema.movie_slot_pricing[movie_key];
        const startingPrice = movie.starting_price || 0;
        const intervalPrice = movie.interval_price || 0;
        const endingPrice = movie.ending_price || 0;

        movie.slots = [
            // Starting slots (1-5)
            ...Array.from({ length: 5 }, (_, i) => ({
                slot_number: i + 1,
                slot_type: 'starting',
                price: startingPrice,
                is_reserved: false,
                reserved_by: "",
                reserved_at: null
            })),
            // Interval slots (6-10)
            ...Array.from({ length: 5 }, (_, i) => ({
                slot_number: i + 6,
                slot_type: 'interval',
                price: intervalPrice,
                is_reserved: false,
                reserved_by: "",
                reserved_at: null
            })),
            // Ending slots (11-15)
            ...Array.from({ length: 5 }, (_, i) => ({
                slot_number: i + 11,
                slot_type: 'ending',
                price: endingPrice,
                is_reserved: false,
                reserved_by: "",
                reserved_at: null
            }))
        ];

        await cinema.save();

        console.log("✅ Successfully updated movie slot prices:", {
            cinemaId: cinema._id,
            movieKey: movie_key,
            startingPrice: starting_price,
            intervalPrice: interval_price,
            endingPrice: ending_price,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: "Movie slot prices updated successfully",
            data: {
                movie_key,
                starting_price: cinema.movie_slot_pricing[movie_key].starting_price,
                interval_price: cinema.movie_slot_pricing[movie_key].interval_price,
                ending_price: cinema.movie_slot_pricing[movie_key].ending_price,
                slots_count: cinema.movie_slot_pricing[movie_key].slots.length
            }
        });

    } catch (error) {
        console.error("❌ Error updating movie slot prices:", error);
        
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

module.exports = {
    getAllCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    deleteCinema,
    getCinemaStats,
    updateSlotPrices,
    updateMovieSlotPrices
};