const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const viewsDir = path.join(__dirname, 'views');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));

const pageMap = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/about': 'about.html',
  '/about.html': 'about.html',
  '/custom': 'custom.html',
  '/custom.html': 'custom.html',
  '/rtw': 'rtw.html',
  '/rtw.html': 'rtw.html',
  '/shop': 'shop.html',
  '/shop.html': 'shop.html',
  '/product': 'product.html',
  '/product.html': 'product.html',
  '/cart': 'cart.html',
  '/cart.html': 'cart.html',
  '/checkout': 'checkout.html',
  '/checkout.html': 'checkout.html',
  '/login': 'login.html',
  '/login.html': 'login.html',
  '/register': 'register.html',
  '/register.html': 'register.html',
  '/filipiniana': 'filipiniana.html',
  '/filipiniana.html': 'filipiniana.html',
  '/kidsandteens': 'kidsandteens.html',
  '/kidsandteens.html': 'kidsandteens.html',
  '/santo': 'santo.html',
  '/santo.html': 'santo.html',
  '/terms': 'terms.html',
  '/terms.html': 'terms.html',
  '/privacy': 'privacy.html',
  '/privacy.html': 'privacy.html',
  '/shipping': 'shipping.html',
  '/shipping.html': 'shipping.html',
};

Object.entries(pageMap).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(viewsDir, file));
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(viewsDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
