import express from 'express';
import { isLoggedIn, isNotBanned } from '../utils/auth';
import {
  createPageHit,
  getAllPageHits,
  getPageHitById,
  getPageHitsByUser,
} from '../controllers/pageHit';
import logger from '../utils/logger';

const router = express.Router();

router.get(
  '/',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const afterDate = req.body.afterDate || null;

    const getAllPageHitsQuery = await getAllPageHits(afterDate);
    if (getAllPageHitsQuery.status) {
      logger.info('[GET /api/pagehits] Got all page hits succesfully!');
      return res.json(getAllPageHitsQuery.data);
    } else {
      logger.error('[GET /api/pagehits] Failed');
      return res.status(400).json({
        err: 'Could not fetch all page hits',
      });
    }
  }
);

router.get(
  '/:id',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const getPageHitQuery = await getPageHitById(id);
    if (getPageHitQuery.status) {
      logger.info(`[GET /api/pagehits/${id}] Got page hit succesfully!`);
      return res.json(getPageHitQuery.data);
    } else {
      logger.error(`[GET /api/pagehits/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch request',
      });
    }
  }
);

router.get(
  '/byuser/:id',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const afterDate = req.body.afterDate || null;

    const getPageHitsQuery = await getPageHitsByUser(id, afterDate);
    if (getPageHitsQuery.status) {
      logger.info(
        `[GET /api/pagehits/byuser/${id}] Got page hits succesfully!`
      );
      return res.json(getPageHitsQuery.data);
    } else {
      logger.error(`[GET /api/pagehits/byuser/${id}] Failed`);
      return res.status(400).json({
        err: 'Could not fetch page hits',
      });
    }
  }
);

router.post(
  '/',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const id = loggedInUser.id;

    const { endpoint, logicalEndpoint } = req.body;

    const createPageHitQuery = await createPageHit(
      endpoint,
      logicalEndpoint,
      id
    );
    if (createPageHitQuery.status) {
      logger.info(`[POST /api/pagehits/] Created page hit succesfully!`);
      return res.json(createPageHitQuery.data);
    } else {
      logger.info(`[POST /api/pagehits/] Failed`);
      return res.status(400).json({
        err: 'Unable to create request',
      });
    }
  }
);

export default router;
