import 'reflect-metadata';
import cors from 'cors';
import compression from 'compression';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import { NODE_ENV, MONGO_URI, SESSION_SECRET } from './utils/constants';
import { initDb } from './utils/db';
import logger from './utils/logger';
import { testRouter, authRouter } from './routes';

const config = require(`./config/config.${NODE_ENV}`);

const app = express();

// TODO: Passport Setup

(async () => {
  // await initDb(); ?
  initDb();

  app.use(helmet());
  app.use(compression());

  app.use(
    cors({
      origin: (requestOrigin: string | undefined, callback) => {
        if (
          (requestOrigin &&
            config.CORS_WHITELIST.indexOf(requestOrigin) !== -1) ||
          config.CORS_WHITELIST.indexOf('*') !== -1
        ) {
          callback(null, true);
        } else {
          const erroMsg = `The CORS policy for this origin doesn't allow access from: ${requestOrigin}`;
          return callback(new Error(erroMsg), false);
        }
      },
      credentials: true,
    })
  );

  app.use(
    session({
      secret: SESSION_SECRET || 'neverThoughtThatThisWouldBeAProblem',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: MONGO_URI || 'mongodb://localhost:27017/test',
      }),
    })
  );

  // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(
    morgan(
      ":remote-addr - :remote-user :date ':method :url HTTP/:http-version' :status :res[content-length] :response-time ms ':referrer' ':user-agent'",
      {
        stream: {
          write: (message) => logger.http(message),
        },
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Primary App Routes
  app.use('/auth', authRouter); // Auth Client Routes
  // app.use('/oauth2', authRouter); // OAuth2 server Routes, etc

  // API Routes
  app.use('/api/test', testRouter);

  app.use(
    (
      _req: express.Request,
      _res: express.Response,
      next: express.NextFunction
    ) => {
      const err: any = new Error('Not Found');
      err.status = 404;
      next(err);
    }
  );

  app.use((err: any, _req: express.Request, res: express.Response) => {
    res.locals.message = err.message;
    res.locals.error = err;

    res.status(err.status || 500);
    res.render('error');
  });
})();

export { app };
