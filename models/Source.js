const mongoose = require('mongoose');

const { Schema } = mongoose;

const sourceSchema = new Schema({
  url: String,
  responseBody: String,
  timestamp: String
});

const Source = mongoose.model('sources', sourceSchema);

module.exports = Source;
