const express = require('express');
const router = express.Router();
const { queryDb } = require('../db');

router.get('/', async (req, res) => {
  req.log.info({}, 'orders.list.start');
  try {
    const result = await queryDb('SELECT * FROM orders', []);
    req.log.info({ count: result.rows.length }, 'orders.list.complete');
    res.json(result.rows);
  } catch (err) {
    req.log.error({ error: err.message }, 'orders.list.failed');
    res.status(500).send('Error fetching orders');
  }
});

router.post('/', async (req, res) => {
  req.log.info({}, 'order.create.start');
  const { product_id, quantity, customer_id } = req.body;
  
  if (!product_id || !quantity || !customer_id) {
    req.log.warn({}, 'order.create.invalid_input');
    return res.status(400).send('Missing fields');
  }

  try {
    const result = await queryDb(
      'INSERT INTO orders (product_id, quantity, customer_id) VALUES ($1, $2, $3) RETURNING *',
      [product_id, quantity, customer_id]
    );
    req.log.info({ orderId: result.rows[0].id }, 'order.create.complete');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    req.log.error({ error: err.message }, 'order.create.failed');
    res.status(500).send('Error creating order');
  }
});

module.exports = router;
