const mongoose = require('mongoose');

const { Schema } = mongoose;

const bodySchema = new Schema({
  name: String,
  moons: [
    {
      moon: String,
      rel: String
    }
  ],
  // mass: {
  //   massValue: Number,
  //   massExponent: Number
  // },
  // radius: Number,
  // gravity: Number,
  // isPlanet: Boolean,
  // aroundBody: {
  //   body: String,
  //   rel: String
  // },
  rel: String
});

const Body = mongoose.model('bodies', bodySchema);

module.exports = Body;
