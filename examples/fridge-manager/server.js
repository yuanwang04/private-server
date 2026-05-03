// Boilerplate Node.js backend for Fridge Manager
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Mock DB connection
// const db = connectToDatabase();

app.get('/api/inventory', (req, res) => {
    res.json({ items: ['Milk', 'Eggs', 'Cheese'] });
});

app.listen(port, () => {
    console.log(`Fridge Manager running on port ${port}`);
});
