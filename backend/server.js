const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));