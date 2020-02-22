const mongoose = require('mongoose');

const { Schema } = mongoose;

const sourceSchema = new Schema({
  url: { type: String, index: true },
  responseBody: String,
  timestamp: String
});

sourceSchema.virtual('expired').get(function() {
  return false;
});

const Source = mongoose.model('sources', sourceSchema);

module.exports = Source;
