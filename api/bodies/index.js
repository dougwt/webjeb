const Body = require('../../models/Body');
const { applyMiddleware, RequestError } = require('../../lib/applyMiddleware');
const withMongoose = require('../../lib/withMongoose');
const appConfig = require('../../lib/appConfig');

module.exports = applyMiddleware([withMongoose], async (req, res) => {
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
              rel
            };
          })
        : null;

      return {
        name,
        moons,
        equatorialRadius,
        mass,
        surfaceGravity,
        aroundBody,
        source,
        rel
      };
    });

    return res.json(bodies);
  } catch (error) {
    console.log(error);
    throw new RequestError(500, 'Unable to query database');
  }
});
