const express = require('express');
const { connectDb } = require('./db');
const ordersRouter = require('./routes/orders');
const { processPayment } = require('./payment');
const crypto = require('crypto');
const { logger, withRequestContext } = require('./logger');

const app = express();
const port = 3000;

app.use(express.json());

logger.info({}, 'server.starting');

connectDb();

app.use((req, res, next) => {
  const reqId = req.get('x-request-id') || crypto.randomUUID();
  withRequestContext(reqId, () => {
    req.id = reqId;
    req.log = logger.child({ reqId });
    next();
  });
});

app.get('/', (req, res) => {
  req.log.info({}, 'healthcheck.ok');
  res.send('Orders API is running');
});

app.use('/orders', ordersRouter);

app.post('/payments', (req, res) => {
  req.log.info({}, 'payment.start');
  processPayment();
  res.send('Payment processed');
});

app.get('/simulate-error', (req, res) => {
  req.log.error({}, 'request.failed');
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  logger.info({ port }, 'server.ready');
});
