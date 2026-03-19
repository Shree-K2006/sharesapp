// Basic stock data using mock objects to simulate Yahoo Finance data.
// A full implementation could use Yahoo-Finance2 library but mocking is more reliable for Indian stock demos.

const MOCK_STOCKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2950.45, change: 1.2, changePercent: 0.04, marketCap: '20T', pe: 28.5, eps: 104, capType: 'Large Cap' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 4120.10, change: -15.4, changePercent: -0.37, marketCap: '15T', pe: 30.1, eps: 137, capType: 'Large Cap' },
  { symbol: 'INFY.NS', name: 'Infosys', price: 1650.80, change: 5.2, changePercent: 0.31, marketCap: '7T', pe: 24.5, eps: 67, capType: 'Large Cap' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1450.25, change: -2.5, changePercent: -0.17, marketCap: '11T', pe: 16.5, eps: 88, capType: 'Large Cap' },
  { symbol: 'ZOMATO.NS', name: 'Zomato Ltd', price: 165.40, change: 4.8, changePercent: 2.9, marketCap: '1.4T', pe: 120, eps: 1.3, capType: 'Large Cap' },
  { symbol: 'SUZLON.NS', name: 'Suzlon Energy', price: 42.10, change: 1.5, changePercent: 3.6, marketCap: '600B', pe: 85, eps: 0.5, capType: 'Mid Cap' },
];

const generateChartData = (basePrice) => {
  return Array.from({ length: 30 }, (_, i) => {
    const volatility = basePrice * 0.02;
    return {
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: +(basePrice + (Math.random() * volatility * 2) - volatility).toFixed(2)
    };
  });
};

const aiAnalysis = (stock) => {
  let risk = 'Medium';
  let recommendation = 'Hold';
  let horizon = 'Mid Term';
  let strengths = ['Market leader in its segment', 'Strong liquidity'];
  let weaknesses = ['Subject to market volatility'];

  if (stock.pe < 20 && stock.eps > 50) {
    risk = 'Low';
    recommendation = 'Buy';
    horizon = 'Long Term';
    strengths.push('Attractive valuation (Low PE)', 'Solid earnings (High EPS)');
  } else if (stock.pe > 80) {
    risk = 'High';
    recommendation = 'Avoid';
    horizon = 'Short Term';
    weaknesses.push('Overvalued stock (High PE)', 'Speculative trading behavior');
  }

  return {
    summary: `Based on quantitative analysis, ${stock.name} is currently a ${recommendation} with a ${risk} risk profile.`,
    risk,
    recommendation,
    horizon,
    strengths,
    weaknesses,
    sentimentScore: stock.changePercent > 0 ? 75 : 45, // basic mock sentiment
    sentimentLevel: stock.changePercent > 0 ? 'Bullish' : 'Bearish'
  };
};

exports.getDashboardData = (req, res) => {
  const trending = MOCK_STOCKS.slice(0, 3);
  const gainers = MOCK_STOCKS.filter(s => s.changePercent > 0).sort((a,b) => b.changePercent - a.changePercent);
  const losers = MOCK_STOCKS.filter(s => s.changePercent < 0).sort((a,b) => a.changePercent - b.changePercent);

  res.json({
    indices: {
      NIFTY_50: { value: 22450.15, change: 120.4, changePercent: 0.54 },
      SENSEX: { value: 74250.30, change: 350.2, changePercent: 0.47 }
    },
    trending,
    gainers,
    losers
  });
};

exports.searchStocks = (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const results = MOCK_STOCKS.filter(s => s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query));
  res.json(results);
};

exports.getStockDetails = (req, res) => {
  const { symbol } = req.params;
  const stock = MOCK_STOCKS.find(s => s.symbol === symbol);
  
  if (!stock) return res.status(404).json({ error: 'Stock not found' });

  const ai = aiAnalysis(stock);
  const chartData = generateChartData(stock.price);

  res.json({ ...stock, aiAnalysis: ai, chartData });
};

exports.compareStocks = (req, res) => {
  const { symbols } = req.body;
  if (!symbols || !Array.isArray(symbols)) return res.status(400).json({ error: 'Provide symbols array' });

  const stocks = symbols.map(sym => {
    const s = MOCK_STOCKS.find(x => x.symbol === sym);
    if(s) {
      return { ...s, aiAnalysis: aiAnalysis(s) };
    }
    return null;
  }).filter(Boolean);

  res.json(stocks);
};

exports.getNews = (req, res) => {
  const { symbol } = req.params;
  const stock = MOCK_STOCKS.find(s => s.symbol === symbol) || { name: 'this stock' };
  
  const news = [
    { title: `Analysts see bright future for ${stock.name}`, source: 'Moneycontrol', time: '2 hours ago', sentiment: 'Positive' },
    { title: `${stock.name} latest quarterly results to be announced`, source: 'Economic Times', time: '5 hours ago', sentiment: 'Neutral' },
    { title: `Global markets impact ${stock.name} stock movement`, source: 'Mint', time: '1 day ago', sentiment: 'Negative' }
  ];

  res.json(news);
};
