import express from 'express';
import { isLoggedIn, isAdminLoggedIn } from '../utils/auth';
import User from '../models/user';
import logger from '../utils/logger';

const router = express.Router();

router.get('/me', isLoggedIn, (req: express.Request, res: express.Response) => {
  logger.info('[GET /api/user/me] Got logged in user succesfully!');
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
      logger.info('[PUT /api/user/me] Updated logged in user succesfully!');
      return res.json(await User.findById(id));
    } catch (e: any) {
      logger.error(`[PUT /api/user/me] ${e.msg}`);
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
      logger.info('[DELETE /api/user/me] Deleted logged in user succesfully!');
      return res.json({
        msg: 'User deleted',
      });
    } catch (e: any) {
      logger.error(`[DELETE /api/user/me] ${e.msg}`);
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
      const users = await User.find();
      logger.info('[GET /api/user/] Got all users succesfully!');
      return res.json(users);
    } catch (e: any) {
      logger.error(`[GET /api/user/] ${e.msg}`);
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
      const user = await User.findById(userId);
      logger.info(`[GET /api/user/${userId}] Got user succesfully!`);
      return res.json(user);
    } catch (e: any) {
      logger.error(`[GET /api/user/${userId}] ${e.msg}`);
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
      const updatedUser = await User.findById(userId);
      logger.info(`[PUT /api/user/${userId}] Updated user successfully`);
      return res.json(updatedUser);
    } catch (e: any) {
      logger.error(`[PUT /api/user/${userId}] ${e.msg}`);
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
      logger.info(`[DELETE /api/user/${userId}] Deleted user successfully`);
      return res.json({
        msg: 'User deleted',
      });
    } catch (e: any) {
      logger.error(`[DELETE /api/user/${userId}] ${e.msg}`);
      return res.status(400).json({
        err: 'User could not be deleted',
      });
    }
  }
);

export default router;
