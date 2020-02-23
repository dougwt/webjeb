const Body = require('../../models/Body');
const { applyMiddleware, RequestError } = require('../../lib/applyMiddleware');
const withMongoose = require('../../lib/withMongoose');
const appConfig = require('../../lib/appConfig');

module.exports = applyMiddleware([withMongoose], async (req, res) => {
  try {
    if (req.method !== 'GET') {
      throw new RequestError(404, 'Unsupported request method');
    }

    console.log('Searching for bodies...');

    let bodies = await Body.find({});

    console.table(bodies);

    bodies = bodies.map(
      ({
        name,
        moons,
        equatorialRadius,
        mass,
        surfaceGravity,
        aroundBody,
        source,
        rel
      }) => {
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
      }
    );

    return res.json(bodies);
  } catch (error) {
    throw new RequestError(500, 'Unable to query database');
  }
});
