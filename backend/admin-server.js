const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
}

function writeProducts(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const products = readProducts();
  const newProduct = req.body;
  newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  if (!newProduct.categories) {
    newProduct.categories = ["Разное"];
  }
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
});