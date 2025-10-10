const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cinemaSchema = new Schema({
    cinema_name: {
        type: String,
        required: [true, "Cinema name is required"],
        trim: true,
        minlength: [2, "Cinema name must be at least 2 characters long"],
        maxlength: [100, "Cinema name cannot exceed 100 characters"]
    },
    cinema_location: {
        type: String,
        required: [true, "Cinema location is required"],
        trim: true,
        minlength: [5, "Cinema location must be at least 5 characters long"],
        maxlength: [200, "Cinema location cannot exceed 200 characters"]
    },
    ongoing_movies: {
        movie_1: {
            name: {
                type: String,
                required: false,
                trim: true,
                maxlength: [100, "Movie name cannot exceed 100 characters"]
            },
            start_date: {
                type: Date,
                required: false
            },
            end_date: {
                type: Date,
                required: false
            },
            trailer_link: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        if (!v) return true; // Allow empty trailer
                        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
                    },
                    message: "Please enter a valid YouTube URL"
                }
            }
        },
        movie_2: {
            name: {
                type: String,
                required: false,
                trim: true,
                maxlength: [100, "Movie name cannot exceed 100 characters"]
            },
            start_date: {
                type: Date,
                required: false
            },
            end_date: {
                type: Date,
                required: false
            },
            trailer_link: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        if (!v) return true; // Allow empty trailer
                        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
                    },
                    message: "Please enter a valid YouTube URL"
                }
            }
        },
        movie_3: {
            name: {
                type: String,
                required: false,
                trim: true,
                maxlength: [100, "Movie name cannot exceed 100 characters"]
            },
            start_date: {
                type: Date,
                required: false
            },
            end_date: {
                type: Date,
                required: false
            },
            trailer_link: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        if (!v) return true; // Allow empty trailer
                        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
                    },
                    message: "Please enter a valid YouTube URL"
                }
            }
        },
        movie_4: {
            name: {
                type: String,
                required: false,
                trim: true,
                maxlength: [100, "Movie name cannot exceed 100 characters"]
            },
            start_date: {
                type: Date,
                required: false
            },
            end_date: {
                type: Date,
                required: false
            },
            trailer_link: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        if (!v) return true; // Allow empty trailer
                        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
                    },
                    message: "Please enter a valid YouTube URL"
                }
            }
        }
    },
    upcoming_movies: {
        movie_1: {
            name: {
                type: String,
                required: false,
                trim: true,
                maxlength: [100, "Movie name cannot exceed 100 characters"]
            },
            trailer_link: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        if (!v) return true; // Allow empty trailer
                        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
                    },
                    message: "Please enter a valid YouTube URL"
                }
            }
        },
        movie_2: {
            name: {
                type: String,
                required: false,
                trim: true,
                maxlength: [100, "Movie name cannot exceed 100 characters"]
            },
            trailer_link: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        if (!v) return true; // Allow empty trailer
                        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
                    },
                    message: "Please enter a valid YouTube URL"
                }
            }
        }
    },
    google_maps_location: {
        type: String,
        trim: true
    },
    // Movie-wise slot pricing
    movie_slot_pricing: {
        movie_1: {
            starting_price: { type: Number, min: 0 },
            interval_price: { type: Number, min: 0 },
            ending_price: { type: Number, min: 0 },
            slots: [{
                slot_number: { type: Number, required: true },
                slot_type: { 
                    type: String, 
                    required: true, 
                    enum: ['starting', 'interval', 'ending'] 
                },
                price: { type: Number, required: true, min: 0 },
                is_reserved: { type: Boolean, default: false },
                reserved_by: { type: String, default: "" },
                reserved_at: { type: Date }
            }]
        },
        movie_2: {
            starting_price: { type: Number, min: 0 },
            interval_price: { type: Number, min: 0 },
            ending_price: { type: Number, min: 0 },
            slots: [{
                slot_number: { type: Number, required: true },
                slot_type: { 
                    type: String, 
                    required: true, 
                    enum: ['starting', 'interval', 'ending'] 
                },
                price: { type: Number, required: true, min: 0 },
                is_reserved: { type: Boolean, default: false },
                reserved_by: { type: String, default: "" },
                reserved_at: { type: Date }
            }]
        },
        movie_3: {
            starting_price: { type: Number, min: 0 },
            interval_price: { type: Number, min: 0 },
            ending_price: { type: Number, min: 0 },
            slots: [{
                slot_number: { type: Number, required: true },
                slot_type: { 
                    type: String, 
                    required: true, 
                    enum: ['starting', 'interval', 'ending'] 
                },
                price: { type: Number, required: true, min: 0 },
                is_reserved: { type: Boolean, default: false },
                reserved_by: { type: String, default: "" },
                reserved_at: { type: Date }
            }]
        },
        movie_4: {
            starting_price: { type: Number, min: 0 },
            interval_price: { type: Number, min: 0 },
            ending_price: { type: Number, min: 0 },
            slots: [{
                slot_number: { type: Number, required: true },
                slot_type: { 
                    type: String, 
                    required: true, 
                    enum: ['starting', 'interval', 'ending'] 
                },
                price: { type: Number, required: true, min: 0 },
                is_reserved: { type: Boolean, default: false },
                reserved_by: { type: String, default: "" },
                reserved_at: { type: Date }
            }]
        }
    },
    contact_info: {
        phone: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    if (!v) return true; // Allow empty phone numbers
                    // Very permissive phone validation - just check it has some digits
                    return /\d/.test(v) && v.length >= 7 && v.length <= 25;
                },
                message: "Please enter a valid phone number (7-25 characters with at least some digits)"
            }
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(v) {
                    if (!v) return true; // Allow empty email
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "Please enter a valid email address"
            }
        }
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    versionKey: false // Removes the __v field
});

// Create indexes for better query performance
cinemaSchema.index({ cinema_name: 1 });
cinemaSchema.index({ cinema_location: 1 });
cinemaSchema.index({ is_active: 1 });
cinemaSchema.index({ createdAt: -1 });

// Virtual for cinema display name
cinemaSchema.virtual('display_name').get(function() {
    return `${this.cinema_name} - ${this.cinema_location}`;
});

// Ensure virtual fields are serialized
cinemaSchema.set('toJSON', { virtuals: true });
cinemaSchema.set('toObject', { virtuals: true });

// Pre-save middleware
cinemaSchema.pre('save', function(next) {
    // Convert cinema name to title case
    if (this.cinema_name) {
        this.cinema_name = this.cinema_name.replace(/\b\w/g, l => l.toUpperCase());
    }
    

    // Initialize movie-wise slot pricing only if completely missing
    if (this.isNew && (!this.movie_slot_pricing || !this.movie_slot_pricing.movie_1)) {
        console.log("🔧 Initializing default movie slot pricing structure");
        this.movie_slot_pricing = {
            movie_1: { starting_price: 0, interval_price: 0, ending_price: 0, slots: [] },
            movie_2: { starting_price: 0, interval_price: 0, ending_price: 0, slots: [] },
            movie_3: { starting_price: 0, interval_price: 0, ending_price: 0, slots: [] },
            movie_4: { starting_price: 0, interval_price: 0, ending_price: 0, slots: [] }
        };
    }
    
    // Generate slots for all movies based on their pricing
    // Only regenerate slots if this is a new document or if pricing has changed
    if (this.movie_slot_pricing && this.movie_slot_pricing.movie_1) {
        const movies = ['movie_1', 'movie_2', 'movie_3', 'movie_4'];
        
        movies.forEach(movieKey => {
            const movie = this.movie_slot_pricing[movieKey];
            if (movie) {
                const startingPrice = movie.starting_price || 0;
                const intervalPrice = movie.interval_price || 0;
                const endingPrice = movie.ending_price || 0;
                
                // Only regenerate slots if:
                // 1. This is a new document (isNew)
                // 2. The slots array is empty or doesn't exist
                // 3. The pricing has changed (check if slots have different prices)
                const shouldRegenerate = this.isNew || 
                    !movie.slots || 
                    movie.slots.length === 0 ||
                    (movie.slots.length > 0 && 
                     (movie.slots[0].price !== startingPrice || 
                      movie.slots[5]?.price !== intervalPrice || 
                      movie.slots[10]?.price !== endingPrice));
                
                if (shouldRegenerate) {
                    console.log(`💰 Generating slots for ${movieKey}:`, { startingPrice, intervalPrice, endingPrice });
                    
                    // Generate slots with the correct prices
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
                        // Interval slots (1-5)
                        ...Array.from({ length: 5 }, (_, i) => ({
                            slot_number: i + 1,
                            slot_type: 'interval',
                            price: intervalPrice,
                            is_reserved: false,
                            reserved_by: "",
                            reserved_at: null
                        })),
                        // Ending slots (1-5)
                        ...Array.from({ length: 5 }, (_, i) => ({
                            slot_number: i + 1,
                            slot_type: 'ending',
                            price: endingPrice,
                            is_reserved: false,
                            reserved_by: "",
                            reserved_at: null
                        }))
                    ];
                    
                    console.log(`✅ Generated ${movie.slots.length} slots for ${movieKey}`);
                } else {
                    console.log(`ℹ️ Keeping existing slots for ${movieKey} (no pricing changes detected)`);
                }
            }
        });
    }
    
    next();
});


// Static method to find active cinemas
cinemaSchema.statics.findActive = function() {
    return this.find({ is_active: true });
};

// Instance method to get cinema summary
cinemaSchema.methods.getSummary = function() {
    return {
        id: this._id,
        name: this.cinema_name,
        location: this.cinema_location,
        movies_count: 4,
        upcoming: this.upcoming_movie,
        is_active: this.is_active
    };
};

module.exports = mongoose.model("Cinema", cinemaSchema);
