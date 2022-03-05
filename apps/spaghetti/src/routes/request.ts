import express from 'express';
import { isLoggedIn, isNotBanned } from '../utils/auth';
import Request from '../models/request';

import { requestStatus } from '@shiftrr/types/models/request';

const router = express.Router();

router.get(
  '/',
  isLoggedIn,
  isNotBanned,
  async (_req: express.Request, res: express.Response) => {
    try {
      const requests = await Request.find({});
      return res.json(requests);
    } catch (e: any) {
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

    try {
      const request = await Request.findById(id);
      return res.json(request);
    } catch (e: any) {
      return res.status(400).json({
        err: 'Could not fetch the request with id: ' + id,
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
    const { service_id, seller_id, price, information } = req.body;
    const status = requestStatus.requested;
    try {
      const request = await Request.create({
        service: service_id,
        seller: seller_id,
        buyer: id,
        price: price,
        information: information,
        status: status,
      });
      return res.json(request);
    } catch (e: any) {
      return res.status(400).json({
        err: e.message,
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
    const { status } = req.body;

    try {
      const request = await Request.findById(request_id);
      if (request != null && request.buyer == id) {
        await Request.findOneAndUpdate({ _id: request_id }, { status });
        return res.json({
          msg: 'Request updated',
          data: await Request.findById(request_id),
        });
      } else {
        return res.status(400).json({
          err: 'You are not the buyer of this request',
        });
      }
    } catch (e: any) {
      return res.status(400).json({
        err: 'User could not be deleted',
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

    try {
      const request = await Request.findById(request_id);
      if (request != null && request.buyer == id) {
        await Request.findByIdAndDelete(id);
        return res.json({
          msg: 'Request deleted',
        });
      } else {
        return res.status(400).json({
          err: 'You are not the buyer of this request',
        });
      }
    } catch (e: any) {
      return res.status(400).json({
        err: 'User could not be deleted',
      });
    }
  }
);

export default router;
