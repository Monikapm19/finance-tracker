const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/financetracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');

app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Finance Tracker API Running');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});