const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const accountsRoute = require('./routes/accounts');
const budgetsRoute = require('./routes/budgets'); // Include this line

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/accounts', accountsRoute);
app.use('/budgets', budgetsRoute); // Add this line to use budgets routes

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
