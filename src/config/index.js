let config = null;

if (process && process.env && process.env.NODE_ENV
  && process.env.NODE_ENV !== 'test') {
  config = require(`./env/${process.env.NODE_ENV}.js`);// eslint-disable-line global-require, import/no-dynamic-require
} else {
  config = require('./env/development.js');// eslint-disable-line global-require
}

module.exports = config;
