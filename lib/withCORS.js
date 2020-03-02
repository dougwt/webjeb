const mongoose = require('mongoose');
const logger = require('./logger');

function withCORS(req, res) {
  logger.debug('executing withCORS middleware', { id: req.id });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
}

module.exports = withCORS;
