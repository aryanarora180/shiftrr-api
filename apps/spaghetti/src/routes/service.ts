import express from 'express';
import { isLoggedIn } from '../utils/auth';
import Service from '../models/service';
import User from '../models/user';
import logger from '../utils/logger';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get(
  '/',
  isLoggedIn,
  async (_req: express.Request, res: express.Response) => {
    try {
      const services = await Service.find();
      logger.info('[GET /api/service/] Got all services succesfully!');
      return res.json(services);
    } catch (e: any) {
      logger.error(`[GET /api/service/] ${e.msg}`);
      return res.status(400).json({
        err: 'Unable to fetch all Services',
      });
    }
  }
);

router.get(
  '/:serviceId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const serviceId = req.params.serviceId;
    try {
      const service = await Service.findById(serviceId);
      logger.info(`[GET /api/service/${serviceId}] Got service succesfully!`);
      return res.json(service);
    } catch (e: any) {
      logger.error(`[GET /api/service/${serviceId}] ${e.msg}`);
      return res.status(400).json({
        err: 'Invalid serviceId',
      });
    }
  }
);

router.post(
  '/',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const loggedInUserId = loggedInUser.id;
    const { name, description, startingPrice, rating } = req.body;

    try {
      const new_service = new Service({
        seller: loggedInUserId,
        name,
        description,
        startingPrice,
        rating,
      });
      await new_service.save();

      const sellerUser = await User.findOne({ _id: loggedInUserId });
      sellerUser!.sellerProfile!.services!.push(new_service._id);
      await sellerUser!.save();

      logger.info('[POST /api/service] Created service succesfully!');
      return res.json(new_service);
    } catch (e: any) {
      logger.error(`[POST /api/service] ${e.msg}`);

      return res.status(400).json({
        err: 'Could not create service',
      });
    }
  }
);

// TODO: Make the updateService use only 1 call to DB
router.put(
  '/:serviceId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const userId = loggedInUser.id;
    const serviceId = req.params.serviceId;

    try {
      await Service.findOneAndUpdate(
        { _id: req.params.serviceId, seller: new ObjectId(userId) },
        req.body
      );

      const updatedService = await Service.findOne({
        _id: req.params.serviceId,
        seller: new ObjectId(userId),
      });

      logger.info(
        `[PUT /api/service/${serviceId}] Updated service succesfully!`
      );

      return res.json(updatedService);
    } catch (e: any) {
      logger.error(`[PUT /api/service/${serviceId}] ${e.msg}`);

      return res.status(400).json({
        err: 'Service could not be updated',
      });
    }
  }
);

// TODO: Fix this method, remove service from user
router.delete(
  '/:serviceId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const userId = loggedInUser.id;
    const serviceId = new ObjectId(req.params.serviceId);

    try {
      const serviceToBeDeleted = await Service.findOne(
        { _id: serviceId, seller: new ObjectId(userId) },
        req.body
      );
      await serviceToBeDeleted!.delete();

      const serviceUser = await User.findOne({ _id: userId });
      const serviceUserServices = serviceUser!.sellerProfile!.services!;
      // TODO: Delete service from serviceUserServices

      logger.info(
        `[DELETE /api/service/${serviceId}] Deleted service succesfully!`
      );

      return res.json({
        msg: 'Service deleted',
      });
    } catch (e: any) {
      logger.error(`[DELETE /api/service/${serviceId}] ${e.msg}`);

      return res.status(400).json({
        err: 'Service could not be deleted',
      });
    }
  }
);
export default router;
