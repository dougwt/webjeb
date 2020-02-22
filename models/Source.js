const mongoose = require('mongoose');
const appConfig = require('../lib/appConfig');

const { Schema } = mongoose;

const sourceSchema = new Schema(
  {
    url: { type: String, index: true },
    responseBody: String
  },
  { timestamps: true }
);

sourceSchema.virtual('expired').get(function() {
  return this.updatedAt.getTime() + appConfig.expiration_ms >= Date.now();
});

const Source = mongoose.model('sources', sourceSchema);

module.exports = Source;
