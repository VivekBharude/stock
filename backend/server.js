const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
app.use(cors());






async function getData() {
  try {
    const url = 'https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2023-01-09?adjusted=true&apiKey=4byFi_CLfXFAWM7_zHWs8Mx4uqYgBGjx';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const stocks = await response.json();
    console.log(stocks);
    // return stocks;
    


    // const stocks = stock.results.slice(0, 20);

//     // Assign a random refresh interval between 1-5 seconds for each stock
// 
for (let i = 0; i < stocks.length; i++) {
  stocks[i].refreshInterval = Math.random() * 4 + 1;
}

// // // Store stock data in a file (e.g., JSON file)
fs.writeFileSync('stock_data.json', JSON.stringify(stocks));

// // // Function to update stock prices
function updateStockPrices(stock) {
  setInterval(() => {
      // Simulate updating stock prices with random values
      stock.c = stock.o + (Math.random() - 0.5);
      console.log(`${stock.T}: ${stock.c}`);
  }, stock.refreshInterval * 50000); // Convert seconds to milliseconds
}

// // // Simulate updating prices for each stock
for (let i = 0; i < stocks.length; i++) {
  updateStockPrices(stocks[i]);
  
}
return stocks;
  } catch (error) {
    console.error('Error fetching data:', error.status || error.message);
    throw error;
  }
} 





app.get('/api/data', async (req, res) => {
  try {
    console.log('Received request for stocks');
    const data = await getData();
    
    console.log('Processed Data:', data);
    res.json(data);
  } catch (error) {
    console.log(error);
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

