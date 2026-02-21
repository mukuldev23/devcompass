const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_URI, {
    autoIndex: env.NODE_ENV !== 'production'
  });
  logger.info('MongoDB connected');
}

module.exports = {
  connectDatabase
};
