const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  location: { lat: Number, lng: Number },
  proximityRange: { type: Number, default: 50 }, // in meters
  attendance: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
});

module.exports = mongoose.model('Session', sessionSchema);
