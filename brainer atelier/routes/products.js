const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db/connection');

// Multer setup for product image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET /api/products — get all products
router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch products.' });
    res.json(results);
  });
});

// GET /api/products/:id — get single product with variants
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM products WHERE id = ?', [id], (err, products) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch product.' });
    if (products.length === 0) return res.status(404).json({ message: 'Product not found.' });

    db.query('SELECT * FROM variants WHERE product_id = ?', [id], (err, variants) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch variants.' });
      res.json({ ...products[0], variants });
    });
  });
});

// POST /api/products — add new product (with image upload)
router.post('/', upload.single('image'), (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }

  db.query(
    'INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, category, image],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to add product.' });
      res.status(201).json({ message: 'Product added.', productId: result.insertId });
    }
  );
});

// POST /api/products/:id/variants — add variant to product
router.post('/:id/variants', (req, res) => {
  const { color, size, stock } = req.body;
  const { id } = req.params;

  db.query(
    'INSERT INTO variants (product_id, color, size, stock) VALUES (?, ?, ?, ?)',
    [id, color, size, stock || 0],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to add variant.' });
      res.status(201).json({ message: 'Variant added.', variantId: result.insertId });
    }
  );
});

// PATCH /api/products/:id — update product details
router.patch('/:id', (req, res) => {
  const { name, description, price, category } = req.body;
  const { id } = req.params;

  db.query(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ? WHERE id = ?',
    [name, description, price, category, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update product.' });
      res.json({ message: 'Product updated.' });
    }
  );
});

// DELETE /api/products/:id — delete product
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete product.' });
    res.json({ message: 'Product deleted.' });
  });
});

module.exports = router;
