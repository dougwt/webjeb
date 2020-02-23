const Body = require('../../models/Body');
const { applyMiddleware, RequestError } = require('../../lib/applyMiddleware');
const withMongoose = require('../../lib/withMongoose');

module.exports = applyMiddleware([withMongoose], async (req, res) => {
  try {
    if (req.method !== 'GET') {
      throw new RequestError(404, 'Unsupported request method');
    }

    const id = req.query.name;
    console.log(`Request: ${id}`);

    const body = await Body.findOne({ name_lower: id.toLowerCase() });
    console.log('result:', body);

    let {
      name,
      moons,
      equatorialRadius,
      mass,
      surfaceGravity,
      aroundBody,
      source
      // rel
    } = body;

    return res.json({
      name,
      moons,
      equatorialRadius,
      mass,
      surfaceGravity,
      aroundBody,
      source
      // rel
    });
  } catch (error) {
    throw new RequestError(500, 'Unable to query database');
  }
});
