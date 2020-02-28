const { applyMiddleware, createSet } = require('micro-mw');
const withCORS = require('./withCORS');
const withHelpers = require('./withHelpers');
const withLogger = require('./withLogger');
const withMongoose = require('./withMongoose');

class RequestError extends Error {
  constructor(status = 500, message, ...args) {
    super(...args);
    this.status = status;
    this.message = message;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }

    this.name = 'RequestError';
  }
}

createSet('default', [withCORS, withHelpers, withLogger, withMongoose]);

function errorHandler(req, res, err) {
  const status = err.status || 500;
  req.error = err;
  console.error(err);
  res.status(status).json({ error: err.message });
}
createSet('errorHandler', [errorHandler]);

module.exports = { applyMiddleware, RequestError };
