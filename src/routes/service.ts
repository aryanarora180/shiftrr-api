import express from 'express';
import { isLoggedIn, isNotBanned } from '../utils/auth';
import logger from '../utils/logger';
import {
  createService,
  deleteService,
  getAllServices,
  getService,
  updateService,
} from '../controllers/service';

const router = express.Router();

router.get(
  '/',
  isLoggedIn,
  isNotBanned,
  async (_req: express.Request, res: express.Response) => {
    try {
      const getAllServicesQuery = await getAllServices();
      if (getAllServicesQuery.status) {
        logger.info('[GET /api/service/] Got all services succesfully!');
        return res.json(getAllServicesQuery.data);
      } else {
        throw new Error();
      }
    } catch (e: any) {
      logger.error(`[GET /api/service/] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch all Services',
      });
    }
  }
);

router.get(
  '/:serviceId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.serviceId;
    try {
      const getServiceQuery = await getService(id);
      if (getServiceQuery.status) {
        logger.info(`[GET /api/service/${id}] Got service succesfully!`);
        return res.json(getServiceQuery.data);
      } else {
        throw new Error();
      }
    } catch (e: any) {
      logger.error(`[GET /api/service/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch service',
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
    const loggedInUserId = loggedInUser.id;
    const { name, description, image, startingPrice } = req.body;

    try {
      const createServiceQuery = await createService(
        loggedInUserId,
        name,
        description,
        image,
        startingPrice
      );
      if (createServiceQuery.status) {
        logger.info('[POST /api/service] Created service succesfully!');
        return res.json(createServiceQuery.data);
      } else {
        throw new Error();
      }
    } catch (e: any) {
      logger.error(`[POST /api/service] Failed`);
      return res.status(400).json({
        err: 'Unable to create service',
      });
    }
  }
);

router.put(
  '/:serviceId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const userId = loggedInUser.id;
    const serviceId = req.params.serviceId;

    try {
      const serviceToBeUpdatedQuery = await updateService(
        serviceId,
        userId,
        req.body
      );
      if (serviceToBeUpdatedQuery.status) {
        logger.info(
          `[PUT /api/service/${serviceId}] Updated service succesfully!`
        );
        return res.json(serviceToBeUpdatedQuery.data);
      } else {
        throw new Error();
      }
    } catch (e: any) {
      logger.error(`[PUT /api/service/${serviceId}] Failed`);
      return res.status(400).json({
        err: 'Service could not be updated',
      });
    }
  }
);

router.delete(
  '/:serviceId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const userId = loggedInUser.id;
    const serviceId = req.params.serviceId;

    try {
      const deleteServiceQuery = await deleteService(serviceId, userId);
      if (deleteServiceQuery.status) {
        logger.info(
          `[DELETE /api/service/${serviceId}] Deleted service succesfully!`
        );
        return res.json({
          msg: 'Service deleted',
        });
      } else {
        throw new Error();
      }
    } catch (e: any) {
      logger.error(`[DELETE /api/service/${serviceId}] Failed`);
      return res.status(400).json({
        err: 'Service could not be deleted',
      });
    }
  }
);

export default router;
