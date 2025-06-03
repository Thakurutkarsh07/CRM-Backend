const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  age: Number,
  gender: String,
  location: String,
  total_spent: Number,
  visits: Number,
  last_order_date: Date
});

module.exports = mongoose.model('Customer', customerSchema);
