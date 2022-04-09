import express from 'express';
import { isLoggedIn, isAdminLoggedIn, isNotBanned } from '../utils/auth';
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  getServicesOfUser,
  getRequestsOfUser,
} from '../controllers/user';
import logger from '../utils/logger';

const router = express.Router();

router.get(
  '/me',
  isLoggedIn,
  isNotBanned,
  (req: express.Request, res: express.Response) => {
    logger.info('[GET /api/user/me] Got logged in user succesfully!');
    return res.json(req.user);
  }
);

router.put(
  '/me',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const id = loggedInUser.id;
    const query = await updateUser(id, req.body);
    if (query.status) {
      logger.info('[PUT /api/user/me] Updated logged in user succesfully!');
      return res.json(query.data);
    } else {
      logger.error(`[PUT /api/user/me] Failed`);
      return res.status(400).json({
        err: 'User could not be updated',
      });
    }
  }
);

router.delete(
  '/me',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const id = loggedInUser.id;
    const deleteUserQuery = await deleteUser(id);
    if (deleteUserQuery.status) {
      logger.info('[DELETE /api/user/me] Deleted logged in user succesfully!');
      return res.json({
        msg: 'User deleted',
      });
    } else {
      logger.error(`[DELETE /api/user/me] Failed`);
      return res.status(400).json({
        err: 'User could not be deleted',
      });
    }
  }
);

router.get(
  '/',
  isLoggedIn,
  isNotBanned,
  async (_req: express.Request, res: express.Response) => {
    const allUsersQuery = await getAllUsers();
    if (allUsersQuery.status) {
      logger.info('[GET /api/user/] Got all users succesfully!');
      return res.json(allUsersQuery.data);
    } else {
      logger.error(`[GET /api/user/] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch all users',
      });
    }
  }
);

router.get(
  '/:userId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const userId = req.params.userId;
    const getUserQuery = await getUser(userId);
    if (getUserQuery.status) {
      logger.info(`[GET /api/user/${userId}] Got user succesfully!`);
      return res.json(getUserQuery.data);
    } else {
      logger.error(`[GET /api/user/${userId}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch user',
      });
    }
  }
);

router.get(
  '/:userId/services',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const getUserServicesQuery = await getServicesOfUser(id);
    if (getUserServicesQuery.status) {
      logger.info(
        `[GET /api/user/${id}/services] Got user's offered services successfully`
      );
      return res.json(getUserServicesQuery.data);
    } else {
      logger.error(`[GET /api/user/${id}/services] Failed`);
      return res.status(400).json({
        err: "Could not get user's offered services",
      });
    }
  }
);

router.get(
  '/:userId/requests',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const getUserRequestsQuery = await getRequestsOfUser(id);
    if (getUserRequestsQuery.status) {
      logger.info(
        `[GET /api/user/${id}/requests] Got user's requests successfully`
      );
      return res.json(getUserRequestsQuery.data);
    } else {
      logger.error(`[GET /api/user/${id}/requests] Failed`);
      return res.status(400).json({
        err: "Could not get user's requests",
      });
    }
  }
);

router.put(
  '/:userId',
  isLoggedIn,
  isAdminLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const updateUserQuery = await updateUser(id, req.body);
    if (updateUserQuery.status) {
      logger.info(`[PUT /api/user/${id}] Updated user successfully`);
      return res.json(updateUserQuery.data);
    } else {
      logger.error(`[PUT /api/user/${id}] Failed`);
      return res.status(400).json({
        err: 'User could not be updated',
      });
    }
  }
);

router.delete(
  '/:userId',
  isLoggedIn,
  isAdminLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const deleteUserQuery = await deleteUser(id);
    if (deleteUserQuery.status) {
      logger.info(`[DELETE /api/user/${id}] Deleted user successfully`);
      return res.json({
        msg: 'User deleted',
      });
    } else {
      logger.error(`[DELETE /api/user/${id}] Failed`);
      return res.status(400).json({
        err: 'User could not be deleted',
      });
    }
  }
);

export default router;
