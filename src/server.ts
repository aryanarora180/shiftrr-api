import { app } from './app';
import { NODE_ENV, SERVER_PORT } from './utils/constants';
import logger from './utils/logger';

/**
 * Start Express server.
 */

const port = SERVER_PORT || 5000;

const server = app.listen(port, () => {
  logger.info(`App is running on port ${port} in ${NODE_ENV} mode`);
});

export default server;
