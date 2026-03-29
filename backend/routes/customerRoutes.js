const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
  const data = await Customer.find();
  res.json(data);
});

module.exports = router;