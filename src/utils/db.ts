import mongoose from 'mongoose';

import logger from './logger';

import { MONGO_BASE_URI, MONGO_URI } from './constants';

export const initDb = async () => {
  const db = MONGO_URI || 'mongodb://localhost:27017/test';
  const options = {};

  try {
    await mongoose.connect(db, options);
    logger.debug(`Connected to ${MONGO_BASE_URI}`);
  } catch (error) {
    logger.error(error);
    console.log(error);
    process.exit();
  }
};
