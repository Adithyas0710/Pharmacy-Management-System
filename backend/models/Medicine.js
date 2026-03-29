const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: String,
  stock: Number,
  price: Number
}, {
  collection: 'inventory'
});

module.exports = mongoose.model('Inventory', inventorySchema, 'inventory');