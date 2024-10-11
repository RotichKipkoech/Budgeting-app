const express = require('express');
const router = express.Router();
const accounts = require('./accounts'); // Adjust this if you have account data structure

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
    const { category, amount } = req.body;

    if (!budgets[username]) {
        budgets[username] = [];
    }
    budgets[username].push({ category, amount });
    res.status(201).json({ message: 'Budget added successfully' });
});

module.exports = router;
