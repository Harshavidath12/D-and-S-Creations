const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const cinemaRoutes = require("./routes/cinemaRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

// Import middleware
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/reservations", reservationRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Cinema Management API is running!",
        version: "1.0.0",
        endpoints: {
            "GET /api/cinemas": "Get all cinemas with pagination and search",
            "GET /api/cinemas/:id": "Get single cinema by ID",
            "POST /api/cinemas": "Create new cinema",
            "PUT /api/cinemas/:id": "Update cinema by ID",
            "DELETE /api/cinemas/:id": "Delete cinema by ID",
            "GET /api/cinemas/stats": "Get cinema statistics"
        },
        documentation: "https://github.com/your-repo/cinema-api"
    });
});

// API documentation endpoint
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Cinema Management API Documentation",
        version: "1.0.0",
        endpoints: {
            cinemas: {
                "GET /api/cinemas": {
                    description: "Get all cinemas with pagination and search",
                    query: {
                        page: "Page number (default: 1)",
                        limit: "Items per page (default: 10, max: 100)",
                        search: "Search term for cinema name or location",
                        is_active: "Filter by active status (true/false)"
                    }
                },
                "GET /api/cinemas/:id": {
                    description: "Get single cinema by ID",
                    params: {
                        id: "MongoDB ObjectId"
                    }
                },
                "POST /api/cinemas": {
                    description: "Create new cinema",
                    body: {
                        cinema_name: "String (required, 2-100 chars)",
                        cinema_location: "String (required, 5-200 chars)",
                        ongoing_movies: {
                            movie_1: {
                                name: "String (required, max 100 chars)",
                                start_date: "Date (required)",
                                end_date: "Date (required)",
                                trailer_link: "String (optional, YouTube URL)"
                            },
                            movie_2: {
                                name: "String (required, max 100 chars)",
                                start_date: "Date (required)",
                                end_date: "Date (required)",
                                trailer_link: "String (optional, YouTube URL)"
                            },
                            movie_3: {
                                name: "String (required, max 100 chars)",
                                start_date: "Date (required)",
                                end_date: "Date (required)",
                                trailer_link: "String (optional, YouTube URL)"
                            },
                            movie_4: {
                                name: "String (required, max 100 chars)",
                                start_date: "Date (required)",
                                end_date: "Date (required)",
                                trailer_link: "String (optional, YouTube URL)"
                            }
                        },
                        upcoming_movies: {
                            movie_1: {
                                name: "String (required, max 100 chars)",
                                trailer_link: "String (optional, YouTube URL)"
                            },
                            movie_2: {
                                name: "String (required, max 100 chars)",
                                trailer_link: "String (optional, YouTube URL)"
                            }
                        },
                        contact_info: {
                            phone: "String (optional, valid phone format)",
                            email: "String (optional, valid email format)"
                        },
                        is_active: "Boolean (optional, default: true)"
                    }
                },
                "PUT /api/cinemas/:id": {
                    description: "Update cinema by ID",
                    params: {
                        id: "MongoDB ObjectId"
                    },
                    body: "Same as POST but all fields optional"
                },
                "DELETE /api/cinemas/:id": {
                    description: "Delete cinema by ID",
                    params: {
                        id: "MongoDB ObjectId"
                    }
                },
                "PUT /api/cinemas/:id/slot-prices": {
                    description: "Update advertisement slot prices",
                    params: {
                        id: "MongoDB ObjectId"
                    },
                    body: {
                        slotType: "String (required): 'start_slots', 'interval_slots', or 'end_slots'",
                        slotNumber: "Number (required): Slot number (1-5)",
                        price: "Number (required): New price (must be >= 0)"
                    }
                },
                "GET /api/cinemas/stats": {
                    description: "Get cinema statistics",
                    response: {
                        total: "Total number of cinemas",
                        active: "Number of active cinemas",
                        inactive: "Number of inactive cinemas",
                        recent: "Number of cinemas created in last 30 days"
                    }
                }
            }
        }
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 
            "mongodb+srv://vihigum:H4UiHdZM640pbRnI@cluster0.sp3lpkf.mongodb.net/test?retryWrites=true&w=majority&tls=true"
        );
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log("🚀 Server running on http://localhost:" + PORT);
        console.log("📋 Available endpoints:");
        console.log("   GET  http://localhost:" + PORT + "/api/cinemas");
        console.log("   POST http://localhost:" + PORT + "/api/cinemas");
        console.log("   GET  http://localhost:" + PORT + "/api/cinemas/stats");
        console.log("📊 Collection: cinemas");
        console.log("🌍 Environment:", process.env.NODE_ENV || "development");
    });
};

startServer();

module.exports = app;