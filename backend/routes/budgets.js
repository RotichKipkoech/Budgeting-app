const express = require('express');
const router = express.Router();

// Sample in-memory storage for budgets
const budgets = {};

// Get budgets for a specific user
router.get('/:username', (req, res) => {
    const username = req.params.username;
    if (budgets[username]) {
        res.json(budgets[username]);
    } else {
        res.status(404).json({ message: 'Budgets not found for this user' });
    }
});

// Add budget for a specific user
router.post('/:username', (req, res) => {
    const username = req.params.username;
    const { category, amount, month, status } = req.body;

    if (!budgets[username]) {
        budgets[username] = [];
    }

    const newBudget = { category, amount, month, status };
    budgets[username].push(newBudget);
    res.status(201).json({ message: 'Budget added successfully', budget: newBudget });
});

// Edit budget for a specific user
router.put('/:username/:index', (req, res) => {
    const username = req.params.username;
    const index = parseInt(req.params.index);

    if (budgets[username] && budgets[username][index]) {
        const { category, amount, month, status } = req.body;
        budgets[username][index] = { category, amount, month, status };
        res.status(200).json({ message: 'Budget updated successfully' });
    } else {
        res.status(404).json({ message: 'Budget not found' });
    }
});

module.exports = router;
