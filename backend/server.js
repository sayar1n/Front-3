const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
}

app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`User server running on http://localhost:${PORT}`);
});