const { AsyncLocalStorage } = require('async_hooks');

const requestContext = new AsyncLocalStorage();
const service = 'orders-api';

const write = (level, bindings, msg) => {
  const context = requestContext.getStore() || {};
  const entry = {
    ts: new Date().toISOString(),
    level,
    service,
    ...context,
    ...bindings,
    msg,
  };

  process.stdout.write(`${JSON.stringify(entry)}\n`);
};

const logger = {
  debug: (bindings, msg) => write('debug', bindings, msg),
  info: (bindings, msg) => write('info', bindings, msg),
  warn: (bindings, msg) => write('warn', bindings, msg),
  error: (bindings, msg) => write('error', bindings, msg),
  child: (bindings) => ({
    debug: (context, msg) => write('debug', { ...bindings, ...context }, msg),
    info: (context, msg) => write('info', { ...bindings, ...context }, msg),
    warn: (context, msg) => write('warn', { ...bindings, ...context }, msg),
    error: (context, msg) => write('error', { ...bindings, ...context }, msg),
  }),
};

const withRequestContext = (reqId, callback) =>
  requestContext.run({ reqId }, callback);

module.exports = { logger, withRequestContext };
