module.exports = {
  db: {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost/webjeb_test',
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  },
  logdna: {
    key: process.env.LOGDNA_INGESTION_KEY,
    app: 'webjeb',
    env: process.env.NODE_ENV || 'development',
    index_meta: true
  },
  expiration_ms: 6 * 60 * 60 * 1000,
  urlPrefix: 'https://webjeb.mycodebytes.com/api',
  wikiUrlPrefix: 'https://wiki.kerbalspaceprogram.com',
  centralBody: 'Kerbol'
};
