// models/CommunicationLog.js

const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  status: { type: String, enum: ['SENT', 'FAILED'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
