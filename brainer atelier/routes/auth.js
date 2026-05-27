const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Check if email already exists
    db.query('SELECT id FROM customers WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      if (results.length > 0) return res.status(409).json({ message: 'Email already registered.' });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO customers (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, phone, address],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Failed to register.' });
          res.status(201).json({ message: 'Account created successfully.' });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  db.query('SELECT * FROM customers WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password.' });

    const customer = results[0];
    const match = await bcrypt.compare(password, customer.password);

    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: customer.id, email: customer.email, name: customer.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    });
  });
});

module.exports = router;
