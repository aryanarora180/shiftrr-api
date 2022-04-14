import express from 'express';
import { isLoggedIn, isNotBanned } from '../utils/auth';
import logger from '../utils/logger';
import {
  getAllSellerReviews,
  createSellerReview,
  getSellerReview,
  getSellerReviews,
  getPosterSellerReviews,
  deleteSellerReview,
} from '../controllers/sellerReview';

const router = express.Router();

// Get all the SellerReviews
router.get(
  '/',
  isLoggedIn,
  isNotBanned,
  async (_req: express.Request, res: express.Response) => {
    const getAllReviewsQuery = await getAllSellerReviews();
    if (getAllReviewsQuery.status) {
      logger.info('[GET /api/reviews/seller] Got all requests succesfully!');
      return res.json(getAllReviewsQuery.data);
    } else {
      logger.error('[GET /api/reviews/seller] Failed');
      return res.status(400).json({
        err: 'Could not fetch all requests',
      });
    }
  }
);

// Get a specific SellerReview by ID
router.get(
  '/:sellerReviewId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.sellerReviewId;
    const getReviewQuery = await getSellerReview(id);
    if (getReviewQuery.status) {
      logger.info(`[GET /api/reviews/seller/${id}] Got review succesfully!`);
      return res.json(getReviewQuery.data);
    } else {
      logger.error(`[GET /api/reviews/seller/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch review',
      });
    }
  }
);

// Get all the SellerReviews for a specific seller's user ID
router.get(
  '/ofseller/:sellerId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.sellerId;
    const getReviewsQuery = await getSellerReviews(id);
    if (getReviewsQuery.status) {
      logger.info(
        `[GET /api/reviews/seller/ofseller/${id}] Got reviews succesfully!`
      );
      return res.json(getReviewsQuery.data);
    } else {
      logger.error(`[GET /api/reviews/seller/ofseller/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch reviews',
      });
    }
  }
);

// Get all the SellerReviews made by a specific user ID
router.get(
  '/byuser/:userId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const getReviewsQuery = await getPosterSellerReviews(id);
    if (getReviewsQuery.status) {
      logger.info(
        `[GET /api/reviews/seller/byuser/${id}] Got reviews succesfully!`
      );
      return res.json(getReviewsQuery.data);
    } else {
      logger.error(`[GET /api/reviews/seller/byuser/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch reviews',
      });
    }
  }
);

// Create a SellerReview (target is fetched from the request id)
router.post(
  '/',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const loggedInUserId = loggedInUser.id;

    const { request_id, comment, rating } = req.body;
    const createSellerReviewQuery = await createSellerReview(
      request_id,
      loggedInUserId,
      comment,
      rating
    );

    if (createSellerReviewQuery.status) {
      logger.info(
        "[POST /api/reviews/seller] Created seller's review succesfully!"
      );
      return res.json(createSellerReviewQuery.data);
    } else {
      logger.error(`[POST /api/reviews/seller] Failed`);
      return res.status(400).json({
        err: 'Unable to create review',
      });
    }
  }
);

// Delete a SellerReview. Poster and logged in user's IDs must match.
router.delete(
  '/:sellerReviewId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const userId = loggedInUser.id;

    const sellerReviewId = req.params.sellerReviewId;
    const deleteReviewQuery = await deleteSellerReview(sellerReviewId, userId);
    if (deleteReviewQuery.status) {
      logger.info(
        `[DELETE /api/reviews/seller/${sellerReviewId}] Deleted review succesfully!`
      );
      return res.json({
        msg: 'Review deleted',
      });
    } else {
      logger.error(`[DELETE /api/reviews/seller/${sellerReviewId}] Failed`);
      return res.status(400).json({
        err: 'Service could not be deleted',
      });
    }
  }
);

export default router;
