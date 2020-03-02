const mongoose = require('mongoose');
const logger = require('./logger');

function getHostName(req) {
  const proto = req.headers['x-forwarded-proto'];
  const host = req.headers['x-forwarded-host'];
  const hostname = `${proto}://${host}`;

  return hostname;
}

function withHelpers(req, res) {
  logger.debug('executing withHelpers middleware', { id: req.id });
  req.hostname = getHostName(req);
}

module.exports = withHelpers;
