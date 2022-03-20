import express from 'express';

import logger from '../utils/logger';

const router = express.Router();

router.get('/', (_req: express.Request, res: express.Response) => {
  logger.error('This is an error Log');
  logger.warn('This is a warn Log');
  logger.info('This is an info Log');
  logger.http('This is a http Log');
  logger.debug('This is a debug Log');

  res.status(200).json({
    msg: 'Hello There',
  });
});

export default router;
