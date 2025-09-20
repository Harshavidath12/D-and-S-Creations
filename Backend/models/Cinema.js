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
            type: String,
            required: [true, "First ongoing movie is required"],
            trim: true,
            maxlength: [100, "Movie name cannot exceed 100 characters"]
        },
        movie_2: {
            type: String,
            required: [true, "Second ongoing movie is required"],
            trim: true,
            maxlength: [100, "Movie name cannot exceed 100 characters"]
        },
        movie_3: {
            type: String,
            required: [true, "Third ongoing movie is required"],
            trim: true,
            maxlength: [100, "Movie name cannot exceed 100 characters"]
        },
        movie_4: {
            type: String,
            required: [true, "Fourth ongoing movie is required"],
            trim: true,
            maxlength: [100, "Movie name cannot exceed 100 characters"]
        }
    },
    upcoming_movie: {
        type: String,
        required: [true, "Upcoming movie is required"],
        trim: true,
        maxlength: [100, "Movie name cannot exceed 100 characters"]
    },
    contact_info: {
        phone: {
            type: String,
            trim: true,
            match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"]
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
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
