const redirect = require('micro-redirect');
const uuid = require('uuid/v4');
const logger = require('./logger');

function captureResponseBody(response) {
  response.body = null;
  response.redirectPath = undefined;

  // wrap res.json() to store data on res object when called
  const oldJSON = response.json;
  response.json = data => {
    // response.body = data && data.toString ? data.toString() : undefined;
    response.body = data ? JSON.parse(JSON.stringify(data)) : undefined;
    return oldJSON.call(response, data);
  };

  // wrap res.redirect() to store data on res object when called
  if (!response.redirect) {
    // Monkey-patch res.redirect to emulate express.js's res.redirect,
    // since it doesn't exist in micro. default redirect status is 302
    // as it is in express. https://expressjs.com/en/api.html#res.redirect
    response.redirect = location => redirect(response, 302, location);
  }
  const oldRedirect = response.redirect;
  response.redirect = location => {
    response.redirectPath = location;
    return oldRedirect.call(response, location);
  };
}

function getBaseUrl(url) {
  // Strip any trailing queries from url path
  return url.split('?').shift();
}

async function withLogger(req, res) {
  const requestStart = Date.now();
  req.id = uuid();
  logger.debug('executing withLogger middleware', { id: req.id });

  // Capture response body and store it at res.body for later use
  captureResponseBody(res);

  res.on('finish', () => {
    const { id, method, query, body, user } = req;
    const url = getBaseUrl(req.url);
    const { statusCode, statusMessage } = res;
    const responseLength = res.body ? res.body.toString().length : 0;
    const userID = user ? user._id : null;
    const timestamp = Date.now();
    const processingTime = Date.now() - requestStart;

    const meta = {
      request: {
        url,
        method,
        query,
        body
      },
      response: {
        statusCode,
        statusMessage,
        headers: res.headers,
        body: res.body,
        redirect: res.redirectPath
      },
      id,
      userID,
      host: req.socket.remoteAddress,
      timestamp,
      processingTime
    };

    logger.info(
      `Request: ${method} ${url} ${statusCode} ${responseLength} ${processingTime}ms ${userID}`,
      meta
    );
    logger.debug('Finished request', { id });
  });
}

module.exports = withLogger;
