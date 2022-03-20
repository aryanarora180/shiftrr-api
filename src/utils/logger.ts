import 'reflect-metadata';
import winston from 'winston';
import { IS_DEV_ENV, IS_PROD_ENV } from './constants';

const config = {
  level: IS_DEV_ENV ? 'debug' : 'warn',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'white',
  },
};

winston.addColors(config.colors);

const logger = winston.createLogger({
  level: config.level,
  levels: config.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.padLevels(),
    winston.format.printf(
      (info) => `[${info.timestamp}] (${info.level}): ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

//
// If we're not in production then log to the `console` **ALSO**
// with the colorized simple format.
//
if (!IS_PROD_ENV) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.padLevels(),
        winston.format.printf(
          (info) => `[${info.timestamp}] (${info.level}): ${info.message}`
        )
      ),
    })
  );
}

export default logger;
