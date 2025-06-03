const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  customer_id: { type: String, required: true },
  amount: Number,
  date: Date
});

module.exports = mongoose.model('Order', orderSchema);
