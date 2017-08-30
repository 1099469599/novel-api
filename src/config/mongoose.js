import mongoose from 'mongoose';
import bluebird from 'bluebird';
import mongooseLong from 'mongoose-long';
import config from './';
// import logger from '../utils/logger';

const logger = { info: console.log };

mongoose.Promise = bluebird;
mongooseLong(mongoose);
mongoose.set('debug', true);

export default function () {
  // create the database connection
  mongoose.set('debug', config.mongooseDebug);

  // when the connection is connected
  mongoose.connection.on('connected', () => {
    // logger.info(`mongoose connection open to ${config.mongodb}`);
  });

  // if the connection throws an error
  mongoose.connection.on('error', err => logger.error(err));

  // when the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    logger.info('mongoose disconnected');
  });

  (async () => await reconnect())();// eslint-disable-line no-return-await
  return mongoose;
}

function reconnect() {
  return new Promise(async (resolve) => {
    try {
      await mongoose.connect(config.mongodb, { useMongoClient: true });
      resolve();
    } catch (err) {
      logger.error(err);
      logger.info(`attempting to reconnect in (${config.mongooseReconnectMs || 1000}) ms`);
      setTimeout(() => {
        resolve(reconnect());
      }, config.mongooseReconnectMs || 1000);
    }
  });
}
