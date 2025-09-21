// models/Pricelist.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pricelistSchema = new mongoose.Schema({
  boardType: {
    type: String,
    required: true,
    unique: true
  },
  dailyRate: {
    type: Number,
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Pricelist', pricelistSchema);
