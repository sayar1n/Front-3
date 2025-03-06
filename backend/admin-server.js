const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Путь к файлу с данными о товарах
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Чтение данных о товарах
function readProducts() {
  return JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
}

// Запись данных о товарах
function writeProducts(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Маршрут для получения всех товаров
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Маршрут для добавления нового товара
app.post('/api/products', (req, res) => {
  const products = readProducts();
  const newProduct = req.body;
  newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  // Убедимся, что categories существует
  if (!newProduct.categories) {
    newProduct.categories = ["Разное"];
  }
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// Маршрут для редактирования товара
app.put('/api/products/:id', (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const updatedProduct = req.body;
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    writeProducts(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

// Маршрут для удаления товара
app.delete('/api/products/:id', (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    writeProducts(products);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
});