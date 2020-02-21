module.exports = {
  db: {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost/webjeb_test',
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  },
  urlPrefix: 'https://webjeb.mycodebytes.com/api',
  wikiUrlPrefix: 'https://wiki.kerbalspaceprogram.com',
  centralBody: 'Kerbol'
};

console.log(module.exports.db.mongoURI);
