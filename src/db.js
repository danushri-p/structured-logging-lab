const { Pool } = require('pg');
const { logger } = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'ordersdb',
  port: process.env.DB_PORT || 5432,
});

const connectDb = async () => {
  logger.info({}, 'db.connecting');
  try {
    await pool.query('SELECT NOW()');
    logger.info({}, 'db.connected');
  } catch (err) {
    logger.warn({ error: err.message }, 'db.connection_failed');
    logger.info({}, 'db.retry_pending');
  }
};

const queryDb = async (text, params) => {
  logger.debug({}, 'db.query.start');
  const res = await pool.query(text, params);
  logger.debug({}, 'db.query.complete');
  return res;
};

module.exports = { connectDb, queryDb, pool };
