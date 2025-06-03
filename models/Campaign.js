// models/Campaign.js

const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  message: String,
  rules: [Object],
  logic: String,
  audience_count: Number,
  status: { type: String, enum: ['PENDING', 'SENT'], default: 'PENDING' }
});

module.exports = mongoose.model('Campaign', campaignSchema);
