const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

// this is just for testing purposes
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/transactions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'transactions.html'));
});

//



app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));