import express from 'express';
import { isLoggedIn, isAdminLoggedIn } from '../utils/auth';
import Service from '../models/service';

const router = express.Router();

router.get('/', async (_req: express.Request, res: express.Response) => {
  try {
    return res.json(await Service.find());
  } catch (e: any) {
    return res.status(400).json({
      err: 'Unable to fetch all Services',
    });
  }
});

router.get(
  '/:serviceId',
  async (req: express.Request, res: express.Response) => {
    const serviceID = req.params.serviceId;
    try {
      return res.json(await Service.findById(serviceID));
    } catch (e: any) {
      return res.status(400).json({
        err: 'Invalid serviceId',
      });
    }
  }
);

router.post('/', (req: express.Request, res: express.Response) => {
  const { seller, name, description, startingPrice, rating } = req.body.data;
  const new_service = new Service({
    seller,
    name,
    description,
    startingPrice,
    rating,
  }).save();
  res.json(new_service);
});

router.put(
  '/:serviceId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user._id;
    try {
      await Service.findOneAndUpdate(
        { _id: req.params.serviceId, 'seller._id': userId },
        req.body
      );
      return res.json(await Service.findById(req.user));
    } catch (e: any) {
      return res.status(400).json({
        err: 'Service could not be updated',
        msg: e,
      });
    }
  }
);

router.delete(
  '/:serviceId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const serviceId = req.params.serviceId;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user._id;
    try {
      await Service.findOneAndDelete({ _id: serviceId, 'seller._id': userId });
      return res.json({
        msg: 'Service deleted',
      });
    } catch (e: any) {
      return res.status(400).json({
        err: 'Service could not be deleted',
      });
    }
  }
);
export default router;
