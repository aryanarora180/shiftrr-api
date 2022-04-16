import express from 'express';
import {
  createRequestReview,
  deleteRequestReview,
  getAllRequestReviews,
  getRequestReviewById,
  getRequestReviewsByPostingUser,
  getRequestReviewsByTarget,
} from '../controllers/requestReview';
import { isLoggedIn, isNotBanned } from '../utils/auth';
import logger from '../utils/logger';

const router = express.Router();

// Get all the requestReviews
router.get(
  '/',
  isLoggedIn,
  isNotBanned,
  async (_req: express.Request, res: express.Response) => {
    const getAllRequestReviewsQuery = await getAllRequestReviews();
    if (getAllRequestReviewsQuery.status) {
      logger.info(
        '[GET /api/reviews/request] Got all requestReviews succesfully!'
      );
      return res.json(getAllRequestReviewsQuery.data);
    } else {
      logger.error('[GET /api/reviews/request] Failed');
      return res.status(400).json({
        err: 'Could not fetch all requestReviews',
      });
    }
  }
);

// Get a specific requestReview by ID
router.get(
  '/:requestReviewId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.requestReviewId;
    const getRequestReviewQuery = await getRequestReviewById(id);
    if (getRequestReviewQuery.status) {
      logger.info(
        `[GET /api/reviews/request/${id}] Got requestReview succesfully!`
      );
      return res.json(getRequestReviewQuery.data);
    } else {
      logger.error(`[GET /api/reviews/request/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch requestReview',
      });
    }
  }
);

// Get requestReviews of a specific Request
router.get(
  '/ofrequest/:requestId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.requestId;
    const getRequestReviewQuery = await getRequestReviewsByTarget(id);
    if (getRequestReviewQuery.status) {
      logger.info(
        `[GET /api/reviews/request/ofrequest/${id}] Got requestReview succesfully!`
      );
      return res.json(getRequestReviewQuery.data);
    } else {
      logger.error(`[GET /api/reviews/request/ofrequest/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch requestReview',
      });
    }
  }
);

// Get requestReviews by Posting User
router.get(
  '/byuser/:posterId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.posterId;
    const getRequestReviewQuery = await getRequestReviewsByPostingUser(id);
    if (getRequestReviewQuery.status) {
      logger.info(
        `[GET /api/reviews/request//byuser/${id}] Got requestReview succesfully!`
      );
      return res.json(getRequestReviewQuery.data);
    } else {
      logger.error(`[GET /api/reviews/request//byuser/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch requestReview',
      });
    }
  }
);

// Create a requestReview
router.post(
  '/',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const loggedInUserId = loggedInUser.id;

    const { request_id, comment, rating } = req.body;
    const createRequestReviewQuery = await createRequestReview(
      request_id,
      loggedInUserId,
      comment,
      rating
    );

    if (createRequestReviewQuery.status) {
      logger.info(
        '[POST /api/reviews/request] Created requestReview succesfully!'
      );
      return res.json(createRequestReviewQuery.data);
    } else {
      logger.error(`[POST /api/reviews/request] Failed`);
      return res.status(400).json({
        err: 'Unable to create requestReview',
      });
    }
  }
);

// Delete a requestReview. Poster and logged in user's IDs must match.
router.delete(
  '/:requestReviewId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const userId = loggedInUser.id;

    const requestReviewId = req.params.requestReviewId;
    const deleteReviewQuery = await deleteRequestReview(
      requestReviewId,
      userId
    );
    if (deleteReviewQuery.status) {
      logger.info(
        `[DELETE /api/reviews/request/${requestReviewId}] Deleted requestReview succesfully!`
      );
      return res.json({
        msg: 'Review deleted',
      });
    } else {
      logger.error(`[DELETE /api/reviews/request/${requestReviewId}] Failed`);
      return res.status(400).json({
        err: 'requestReview could not be deleted',
      });
    }
  }
);

export default router;
