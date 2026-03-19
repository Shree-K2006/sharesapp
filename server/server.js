require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const stocksRouter = require('./routes/stocks');
app.use('/api/stocks', stocksRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SharesApp Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
