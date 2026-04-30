const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3309;
const viewsDir = path.join(__dirname, 'views');
const imagesDir = path.join(__dirname, 'public', 'images');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function formatCollectionName(name) {
  return name
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getRtwCatalog() {
  if (!fs.existsSync(imagesDir)) {
    return [];
  }

  return fs
    .readdirSync(imagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const folderPath = path.join(imagesDir, entry.name);
      const images = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((file) => file.isFile() && imageExtensions.has(path.extname(file.name).toLowerCase()))
        .map((file) => `/images/${encodeURIComponent(entry.name)}/${encodeURIComponent(file.name)}`);

      return {
        slug: entry.name,
        name: formatCollectionName(entry.name),
        images,
        coverImage: images[0] || null,
        photoCount: images.length,
      };
    })
    .filter((item) => item.images.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/rtw-catalog', (req, res) => {
  res.json(getRtwCatalog());
});

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
