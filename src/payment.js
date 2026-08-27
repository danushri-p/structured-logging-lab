const { logger } = require('./logger');

const processPayment = () => {
  logger.info({}, 'payment.processing');
  // Simulate some payment processing
  setTimeout(() => {
    logger.info({}, 'payment.completed');
  }, 500);
};

module.exports = { processPayment };
