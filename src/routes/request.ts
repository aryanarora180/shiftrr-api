import express from 'express';
import { isLoggedIn, isNotBanned } from '../utils/auth';
import {
  createRequest,
  deleteRequest,
  getAllRequests,
  getRequest,
  updateRequest,
} from '../controllers/request';
import logger from '../utils/logger';

const router = express.Router();

router.get(
  '/',
  isLoggedIn,
  isNotBanned,
  async (_req: express.Request, res: express.Response) => {
    const getAllRequestsQuery = await getAllRequests();
    if (getAllRequestsQuery.status) {
      logger.info('[GET /api/requests] Got all requests succesfully!');
      return res.json(getAllRequestsQuery.data);
    } else {
      logger.error('[GET /api/requests] Failed');
      return res.status(400).json({
        err: 'Could not fetch all requests',
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
    const getRequestQuery = await getRequest(id);
    if (getRequestQuery.status) {
      logger.info(`[GET /api/requests/${id}] Got request succesfully!`);
      return res.json(getRequestQuery.data);
    } else {
      logger.error(`[GET /api/requests/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch request',
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
    const { service, price, information } = req.body;
    const createRequestQuery = await createRequest(
      service,
      id,
      price,
      information
    );
    if (createRequestQuery.status) {
      logger.info(`[PUT /api/requests/] Created request succesfully!`);
      return res.json(createRequestQuery.data);
    } else {
      logger.info(`[PUT /api/requests/] Failed`);
      return res.status(400).json({
        err: 'Unable to create request',
      });
    }
  }
);

router.put(
  '/:request_id',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const id = loggedInUser.id;
    const { request_id } = req.params;
    const updateRequestQuery = await updateRequest(request_id, id, req.body);
    if (updateRequestQuery.status) {
      logger.info(
        `[PUT /api/service/${request_id}] Updated request succesfully!`
      );
      return res.json(updateRequestQuery.data);
    } else {
      logger.error(`[PUT /api/service/${request_id}] Failed`);
      return res.status(400).json({
        err: 'Request could not be updated',
      });
    }
  }
);

router.delete(
  '/:request_id',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const id = loggedInUser.id;
    const { request_id } = req.params;
    const deleteRequestQuery = await deleteRequest(request_id, id);
    if (deleteRequestQuery.status) {
      logger.info(
        `[DELETE /api/requests/${request_id}] Deleted request succesfully!`
      );
      return res.json({
        msg: 'Request deleted',
      });
    } else {
      logger.error(`[DELETE /api/requests/${request_id}] Failed`);
      return res.status(400).json({
        err: 'Unable to delete request',
      });
    }
  }
);

export default router;
