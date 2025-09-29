const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['video editing', 'image editing'], required: true },
  previousDesigns: { type: [String], default: [] }, 
  email: { type: String, unique: true, sparse: true } 
});

module.exports = mongoose.model('Designer', designerSchema);
