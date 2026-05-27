const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Cart is managed on the frontend via localStorage.
// This route is used to validate stock before checkout.

// POST /api/cart/validate — check if items are still in stock
router.post('/validate', (req, res) => {
  const { items } = req.body;
  // items: [{ variant_id, quantity }]

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items to validate.' });
  }

  const variantIds = items.map((item) => item.variant_id);

  db.query(
    'SELECT id, stock, color, size FROM variants WHERE id IN (?)',
    [variantIds],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to validate cart.' });

      const issues = [];

      items.forEach((item) => {
        const variant = results.find((v) => v.id === item.variant_id);
        if (!variant) {
          issues.push({ variant_id: item.variant_id, message: 'Variant not found.' });
        } else if (variant.stock < item.quantity) {
          issues.push({
            variant_id: item.variant_id,
            color: variant.color,
            size: variant.size,
            available: variant.stock,
            message: `Only ${variant.stock} left in stock.`,
          });
        }
      });

      if (issues.length > 0) {
        return res.status(409).json({ message: 'Some items have stock issues.', issues });
      }

      res.json({ message: 'All items are available.' });
    }
  );
});

module.exports = router;
