const express = require('express');
const router = express.Router();
const Inventory = require('../models/Medicine');

// ➕ Add inventory item
router.post('/add', async (req, res) => {
  const item = new Inventory(req.body);
  await item.save();
  res.json(item);
});

// 📦 Get all inventory items
router.get('/', async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

module.exports = router;