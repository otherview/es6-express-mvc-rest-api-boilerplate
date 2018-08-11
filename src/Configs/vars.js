const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  repository: {
    uri: process.env.NODE_ENV === 'prod'
      ? process.env.ELASTIC_URI
      : process.env.ELASTIC_URI,
    usersIndex: process.env.NODE_ENV === 'prod'
      ? process.env.ELASTIC_USER_INDEX
      : process.env.ELASTIC_USER_INDEX_TEST,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
