const Body = require('../../models/Body');
// const logger = require('../../lib/logger');
const { applyMiddleware, RequestError } = require('../../lib/applyMiddleware');
const appConfig = require('../../lib/appConfig');

module.exports = applyMiddleware(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      throw new RequestError(404, 'Unsupported request method');
    }

    let bodies = await Body.find({});

    bodies = bodies.map(body => {
      // Nicely format each planetary body
      let {
        name,
        moons,
        equatorialRadius,
        mass,
        surfaceGravity,
        aroundBody,
        source,
        rel
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

      return {
        name,
        moons,
        equatorialRadius,
        mass,
        surfaceGravity,
        aroundBody,
        source,
        rel: `${req.hostname}${appConfig.apiPathPrefix}${rel}/`
      };
    });

    return res.json(bodies);
  } catch (error) {
    throw new RequestError(500, 'Unable to query database');
  }
});
