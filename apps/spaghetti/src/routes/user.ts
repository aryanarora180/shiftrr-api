import express from 'express';
import { isLoggedIn, isAdminLoggedIn } from '../utils/auth';
import User from '../models/user';

const router = express.Router();

router.get('/me', isLoggedIn, (req: express.Request, res: express.Response) => {
  return res.json({
    msg: req.user,
  });
});

router.put(
  '/me',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const id = loggedInUser.id;
    const data = req.body;
    try {
      await User.findOneAndUpdate({ _id: id }, data);
      return res.json(await User.findById(id));
    } catch (e: any) {
      return res.status(400).json({
        err: 'User could not be updated',
      });
    }
  }
);

router.delete(
  '/me',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const id = loggedInUser.id;
    try {
      await User.findOneAndDelete({ _id: id });
      return res.json({
        msg: 'User deleted',
      });
    } catch (e: any) {
      return res.status(400).json({
        err: 'User could not be deleted',
      });
    }
  }
);

router.get(
  '/',
  isLoggedIn,
  async (_req: express.Request, res: express.Response) => {
    try {
      return res.json(await User.find());
    } catch (e: any) {
      return res.status(400).json({
        err: 'Unable to fetch all users',
      });
    }
  }
);

router.get(
  '/:userId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const userId = req.params.userId;
    try {
      return res.json(await User.findById(userId));
    } catch (e: any) {
      return res.status(400).json({
        err: 'Invalid userId',
      });
    }
  }
);

router.put(
  '/:userId',
  isAdminLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const userId = req.params.userId;
    const data = req.body;
    try {
      await User.findOneAndUpdate({ _id: userId }, data);
      return res.json(await User.findById(userId));
    } catch (e: any) {
      return res.status(400).json({
        err: 'User could not be updated',
      });
    }
  }
);

router.delete(
  '/:userId',
  isAdminLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const userId = req.params.userId;
    try {
      await User.findOneAndDelete({ _id: userId });
      return res.json({
        msg: 'User deleted',
      });
    } catch (e: any) {
      return res.status(400).json({
        err: 'User could not be deleted',
      });
    }
  }
);

export default router;
