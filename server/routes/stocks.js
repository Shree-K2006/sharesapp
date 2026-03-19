const express = require('express');
const router = express.Router();
const { 
  getDashboardData, 
  searchStocks, 
  getStockDetails, 
  compareStocks,
  getNews
} = require('../controllers/stocksController');

router.get('/dashboard', getDashboardData);
router.get('/search', searchStocks);
router.get('/:symbol', getStockDetails);
router.get('/:symbol/news', getNews);
router.post('/compare', compareStocks);

module.exports = router;
