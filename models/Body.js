const mongoose = require('mongoose');
const appConfig = require('../lib/appConfig');

const { Schema } = mongoose;

const bodySchema = new Schema(
  {
    id: String,
    name: String,
    moons: [
      {
        moon: String,
        rel: String
      }
    ],
    // orbit: {
    //   // semimajorAxis
    //   // periapsis
    //   // apoapsis
    //   // orbitalEccentricity
    //   // orbitalInclination
    //   // argumentOfPeriapsis
    //   // longitudeOfAscendingNode
    //   // meanAnomoly
    //   // sideralOrbitalPeriod
    //   // synodicOrbitalPeriod
    // },
    equatorialRadius: Number,
    // equitorialCircumference
    // surfaceArea: {
    //   // areaValue
    //   // areaExponent
    // },
    mass: {
      massValue: Number,
      massExponent: Number
    },
    // standardGravitationalParameter
    // density
    surfaceGravity: Number,
    // escapeVelocity
    // siderealRotationPeriod
    // solarDay
    // siderealRotationalVelocity
    // synchronousOrbit
    // sphereOfInfluence
    // atmosphere: {
    //   // atmospherePresent
    //   // atmosphericPressure
    //   // atmosphericHeight
    //   // temperatureMin
    //   // temperatureMax
    //   // oxygenPresent
    // },
    // scientificMultiplier: {
    //   // surface
    //   // splashed
    //   // lowerAtmosphere
    //   // upperAtmosphere
    //   // nearSpace
    //   // outerSpace
    //   // recovery
    // },
    aroundBody: {
      body: String,
      rel: String
    },
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
