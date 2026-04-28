const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const verifyToken = require('../middleware/auth');

// POST /api/orders — place an order (requires login)
router.post('/', verifyToken, (req, res) => {
  const customer_id = req.customer.id;
  const { items } = req.body;
  // items: [{ variant_id, quantity, price_at_purchase }]

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order.' });
  }

  const total = items.reduce((sum, item) => sum + item.price_at_purchase * item.quantity, 0);

  db.query(
    'INSERT INTO orders (customer_id, total) VALUES (?, ?)',
    [customer_id, total],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to create order.' });

      const order_id = result.insertId;
      const orderItems = items.map((item) => [
        order_id,
        item.variant_id,
        item.quantity,
        item.price_at_purchase,
      ]);

      db.query(
        'INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase) VALUES ?',
        [orderItems],
        (err) => {
          if (err) return res.status(500).json({ message: 'Failed to save order items.' });

          // Deduct stock for each variant
          items.forEach((item) => {
            db.query(
              'UPDATE variants SET stock = stock - ? WHERE id = ?',
              [item.quantity, item.variant_id]
            );
          });

          res.status(201).json({ message: 'Order placed successfully.', order_id });
        }
      );
    }
  );
});

// GET /api/orders — get logged-in customer's orders
router.get('/', verifyToken, (req, res) => {
  const customer_id = req.customer.id;

  db.query(
    `SELECT o.id, o.total, o.status, o.created_at,
      oi.quantity, oi.price_at_purchase,
      v.color, v.size,
      p.name AS product_name, p.image
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN variants v ON oi.variant_id = v.id
    JOIN products p ON v.product_id = p.id
    WHERE o.customer_id = ?
    ORDER BY o.created_at DESC`,
    [customer_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch orders.' });
      res.json(results);
    }
  );
});

// PATCH /api/orders/:id/status — update order status (admin use)
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update status.' });
    res.json({ message: `Order status updated to ${status}.` });
  });
});

module.exports = router;
