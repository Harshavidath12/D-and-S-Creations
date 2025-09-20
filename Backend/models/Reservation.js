const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    // Basic reservation info
    reservation_id: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    
    // Cinema and movie details
    cinema_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true
    },
    cinema_name: {
        type: String,
        required: true
    },
    cinema_location: {
        type: String,
        required: true
    },
    movie_name: {
        type: String,
        required: true
    },
    movie_key: {
        type: String,
        required: true,
        enum: ['movie_1', 'movie_2', 'movie_3', 'movie_4']
    },
    
    // Show details
    show_date: {
        type: Date,
        required: true
    },
    show_time: {
        type: String,
        required: true
    },
    
    // Advertisement slots
    advertisement_slots: [{
        slot_id: {
            type: String,
            required: true
        },
        slot_type: {
            type: String,
            required: true,
            enum: ['starting', 'interval', 'ending']
        },
        slot_number: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    
    // Advertisement details
    advertisement_duration: {
        type: Number,
        required: true,
        min: 15,
        max: 120
    },
    
    // Customer details
    customer_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "Customer name cannot exceed 100 characters"]
    },
    customer_email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Please enter a valid email address"
        }
    },
    customer_phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /\d/.test(v) && v.length >= 7 && v.length <= 25;
            },
            message: "Please enter a valid phone number"
        }
    },
    company_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "Company name cannot exceed 100 characters"]
    },
    
    // Pricing
    total_amount: {
        type: Number,
        required: true,
        min: 0
    },
    
    // Status and tracking
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    
    // Payment details
    payment_status: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    payment_method: {
        type: String,
        enum: ['cash', 'card', 'online', 'bank_transfer'],
        default: 'online'
    },
    payment_reference: {
        type: String,
        trim: true
    },
    
    // Timestamps
    reserved_at: {
        type: Date,
        default: Date.now
    },
    confirmed_at: {
        type: Date
    },
    cancelled_at: {
        type: Date
    },
    
    // Additional notes
    notes: {
        type: String,
        maxlength: [500, "Notes cannot exceed 500 characters"]
    }
}, {
    timestamps: true,
    versionKey: false
});

// Create indexes for better query performance
reservationSchema.index({ reservation_id: 1 });
reservationSchema.index({ cinema_id: 1 });
reservationSchema.index({ customer_email: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ show_date: 1 });
reservationSchema.index({ created_at: -1 });

// Pre-save middleware to generate reservation ID
reservationSchema.pre('save', function(next) {
    if (this.isNew && !this.reservation_id) {
        // Generate reservation ID: RES + timestamp + random 4 digits
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.reservation_id = `RES${timestamp}${random}`;
    }
    next();
});

// Virtual for formatted show date
reservationSchema.virtual('formatted_show_date').get(function() {
    return this.show_date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Virtual for total slots count
reservationSchema.virtual('total_slots').get(function() {
    return this.advertisement_slots.length;
});

// Instance method to get reservation summary
reservationSchema.methods.getSummary = function() {
    return {
        reservation_id: this.reservation_id,
        cinema_name: this.cinema_name,
        movie_name: this.movie_name,
        show_date: this.formatted_show_date,
        show_time: this.show_time,
        total_slots: this.total_slots,
        total_amount: this.total_amount,
        status: this.status,
        created_at: this.createdAt
    };
};

// Static method to find reservations by customer email
reservationSchema.statics.findByCustomerEmail = function(email) {
    return this.find({ customer_email: email }).sort({ createdAt: -1 });
};

// Static method to find reservations by cinema
reservationSchema.statics.findByCinema = function(cinemaId) {
    return this.find({ cinema_id: cinemaId }).sort({ show_date: 1 });
};

// Static method to find reservations by date range
reservationSchema.statics.findByDateRange = function(startDate, endDate) {
    return this.find({
        show_date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ show_date: 1 });
};

// Ensure virtual fields are serialized
reservationSchema.set('toJSON', { virtuals: true });
reservationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Reservation", reservationSchema);
