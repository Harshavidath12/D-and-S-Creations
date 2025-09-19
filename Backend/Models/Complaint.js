const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
  clientName: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
