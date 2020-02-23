const winston = require('winston');
const LogdnaWinston = require('logdna-winston');
const appConfig = require('./appConfig');

const level = process.env.LOGGING_LEVEL || 'info';

const logger = winston.createLogger({
  transports: [new winston.transports.Console({ level })],
  exitOnError: false
});

// If config contains a logdna key, add a logdna transport
if (appConfig.logdna.key) {
  logger.add(new LogdnaWinston(appConfig.logdna));
  logger.debug('Creating logdna transport');
}

module.exports = logger;
