const mongoose = require('mongoose');
const appConfig = require('../lib/appConfig');

const { Schema } = mongoose;

const bodySchema = new Schema(
  {
    name: String,
    moons: [
      {
        moon: String,
        rel: String
      }
    ],
    aroundBody: {
      body: String,
      rel: String
    },
    mass: {
      massValue: Number,
      massExponent: Number
    },
    radius: Number,
    gravity: Number,
    source: String,
    rel: String
  },
  { timestamps: true }
);

bodySchema.virtual('isStar').get(function() {
  return this.aroundBody === null;
});
bodySchema.virtual('isPlanet').get(function() {
  return this.aroundBody && this.aroundBody.body === appConfig.centralBody;
});
bodySchema.virtual('isMoon').get(function() {
  return !this.isStar && !this.isPlanet;
});

const Body = mongoose.model('bodies', bodySchema);

module.exports = Body;
