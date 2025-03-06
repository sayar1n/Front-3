const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Путь к файлу с данными о товарах
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Чтение данных о товарах
function readProducts() {
  return JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
}

// Маршрут для получения всех товаров
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`User server running on http://localhost:${PORT}`);
});