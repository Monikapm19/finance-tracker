const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Calculate spending for budgets in a specific month
router.get('/calculate/:month', async (req, res) => {
  try {
    const Transaction = require('../models/Transaction');
    const budgets = await Budget.find({ month: req.params.month });
    
    for (let budget of budgets) {
      // Calculate total spent in this category this month
      const startDate = new Date(req.params.month + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      const transactions = await Transaction.find({
        category: budget.category,
        type: 'expense',
        date: { $gte: startDate, $lte: endDate }
      });
      
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      
      budget.spent = totalSpent;
      await budget.save();
    }
    
    const updatedBudgets = await Budget.find({ month: req.params.month });
    res.json(updatedBudgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new budget
router.post('/', async (req, res) => {
  const budget = new Budget({
    category: req.body.category,
    limit: req.body.limit,
    spent: req.body.spent || 0,
    month: req.body.month
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;