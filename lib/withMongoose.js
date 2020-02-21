const mongoose = require('mongoose');
const appConfig = require('./appConfig');

async function withMongoose(req, res) {
  console.debug('executing withMongoose middleware', { id: req.id });
  mongoose.Promise = global.Promise;
  try {
    await mongoose.connect(appConfig.db.mongoURI, appConfig.db.mongoOptions);
    console.debug('mongoose connected', { id: req.id });
  } catch (err) {
    // TODO: handle error better
    res.status(500).send({ error: 'Unable to connect to database' });
  }

  mongoose.connection.on('error', err => {
    // TODO: handle error better
    console.error(err);
    res.status(500).send({ error: 'Connection to database failed' });
  });
}

module.exports = withMongoose;
