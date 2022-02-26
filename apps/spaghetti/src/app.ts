import 'reflect-metadata';
import cors from 'cors';
import compression from 'compression';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { ObjectId } from 'mongodb';
import morgan from 'morgan';
import passport from 'passport';

import {
  NODE_ENV,
  MONGO_URI,
  SESSION_SECRET,
  IS_PROD_ENV,
} from './utils/constants';
import { initDb } from './utils/db';
import logger from './utils/logger';
import { GoogleOAuthStrategy } from './utils/strategies/google.oauth';
import User from './models/user';
import { testRouter, authRouter, userRouter } from './routes';

const config = require(`./config/config.${NODE_ENV}`);

const app = express();

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

  if (IS_PROD_ENV) {
    app.set('trust proxy', 1);
  }

  app.use(
    session({
      secret: SESSION_SECRET || 'neverThoughtThatThisWouldBeAProblem',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: MONGO_URI || 'mongodb://localhost:27017/test',
      }),
      cookie: config.COOKIE_CONFIG,
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

  passport.serializeUser((user: any, done: any) => {
    return done(null, user._id);
  });

  passport.deserializeUser((_id: ObjectId, done: any) => {
    // TODO: Change doc to IMongoDBUser interface
    User.findOne({ _id }, (err: Error, doc: any) => {
      if (err) {
        return done(err, null);
      }
      return done(null, doc);
    });
  });

  passport.use(GoogleOAuthStrategy);

  // Primary App Routes
  app.use('/auth', authRouter); // Auth Client Routes

  // API Routes
  app.use('/api/test', testRouter);
  app.use('/api/user', userRouter);

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
