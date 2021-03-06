const Body = require('../../../models/Body');
const {
  applyMiddleware,
  RequestError
} = require('../../../lib/applyMiddleware');
const logger = require('../../../lib/logger');
const appConfig = require('../../../lib/appConfig');

module.exports = applyMiddleware(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      throw new RequestError(404, 'Unsupported request method');
    }

    const id = req.query.name;
    logger.debug(`Request: ${id}`);

    const body = await Body.findOne({ name_lower: id.toLowerCase() });
    logger.debug('result:', body);

    // Nicely format the planetary body
    let {
      name,
      moons,
      equatorialRadius,
      mass,
      surfaceGravity,
      aroundBody,
      source
      // rel  // disabled b/c this would just link to itself
    } = body;

    moons = moons
      ? moons.map(({ moon, rel }) => {
          return {
            moon,
            rel: `${req.hostname}${appConfig.apiPathPrefix}${rel}/`
          };
        })
      : null;

    if (aroundBody && aroundBody.body && aroundBody.rel) {
      aroundBody = {
        body: aroundBody.body,
        rel: `${req.hostname}${appConfig.apiPathPrefix}${aroundBody.rel}/`
      };
    }

    return res.json({
      name,
      moons,
      equatorialRadius,
      mass,
      surfaceGravity,
      aroundBody,
      source
      // rel  // disabled b/c this would just link to itself
    });
  } catch (error) {
    throw new RequestError(500, 'Unable to query database');
  }
});
