const express = require('express');
const router = express.Router();

let users = []; // In-memory storage for demonstration

router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'adminpass') {
        return res.status(200).send({ message: 'Admin logged in' });
    }
    return res.status(401).send({ message: 'Invalid credentials' });
});

router.post('/admin/accounts', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password, budgets: [] });
    return res.status(201).send({ message: 'User created' });
});

router.get('/admin/accounts', (req, res) => {
    return res.status(200).send(users);
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return res.status(200).send(user);
    }
    return res.status(401).send({ message: 'Invalid credentials' });
});

module.exports = router;
