const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  month: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Budget', BudgetSchema);