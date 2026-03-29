const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  visits: { type: Number, default: 1 }
});

module.exports = mongoose.model('Customer', customerSchema);