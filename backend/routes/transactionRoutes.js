const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');

// ➕ Add Transaction
router.post('/add', async (req, res) => {
  try {
    const { customer_phone, customer_name } = req.body;

    // Save transaction
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();

    // Update customer
    let customer = await Customer.findOne({ phone: customer_phone });

    if (customer) {
      customer.visits += 1;
      await customer.save();
    } else {
      await Customer.create({
        name: customer_name,
        phone: customer_phone
      });
    }

    res.json({ message: "Transaction saved" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔍 Search customer transactions
router.get('/search/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const data = await Transaction.find({
      $or: [
        { customer_phone: phone },
        { phone: phone }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📊 Total sales
router.get('/summary', async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total_amount" }
        }
      }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;