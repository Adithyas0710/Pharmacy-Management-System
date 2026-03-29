const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customer_phone: String,
  medicines: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  total_amount: Number,
  payment_mode: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);