import express from 'express';
import { isLoggedIn, isNotBanned } from '../utils/auth';
import logger from '../utils/logger';
import {
  getAllSellerReviews,
  createSellerReview,
  getSellerReviewById,
  getSellerReviewsBySellerUser,
  getSellerReviewsByPostingUser,
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
      logger.info(
        '[GET /api/reviews/seller] Got all sellerReviews succesfully!'
      );
      return res.json(getAllReviewsQuery.data);
    } else {
      logger.error('[GET /api/reviews/seller] Failed');
      return res.status(400).json({
        err: 'Could not fetch all sellerReviews',
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
    const getReviewQuery = await getSellerReviewById(id);
    if (getReviewQuery.status) {
      logger.info(
        `[GET /api/reviews/seller/${id}] Got sellerReview succesfully!`
      );
      return res.json(getReviewQuery.data);
    } else {
      logger.error(`[GET /api/reviews/seller/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch sellerReview',
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
    const getReviewsQuery = await getSellerReviewsBySellerUser(id);
    if (getReviewsQuery.status) {
      logger.info(
        `[GET /api/reviews/seller/ofseller/${id}] Got sellerReviews succesfully!`
      );
      return res.json(getReviewsQuery.data);
    } else {
      logger.error(`[GET /api/reviews/seller/ofseller/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch sellerReviews',
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
    const getReviewsQuery = await getSellerReviewsByPostingUser(id);
    if (getReviewsQuery.status) {
      logger.info(
        `[GET /api/reviews/seller/byuser/${id}] Got sellerReviews succesfully!`
      );
      return res.json(getReviewsQuery.data);
    } else {
      logger.error(`[GET /api/reviews/seller/byuser/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch sellerReviews',
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

    // TODO: Verify that the current user is the buyer of the request;
    // Can pass current logged in user's id to the controller method and check that the buyer id is the same as logged in user's id
    const { request_id, comment, rating } = req.body;
    const createSellerReviewQuery = await createSellerReview(
      request_id,
      comment,
      rating
    );

    if (createSellerReviewQuery.status) {
      logger.info(
        '[POST /api/reviews/seller] Created sellerReview succesfully!'
      );
      return res.json(createSellerReviewQuery.data);
    } else {
      logger.error(`[POST /api/reviews/seller] Failed`);
      return res.status(400).json({
        err: 'Unable to create sellerReview',
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
        `[DELETE /api/reviews/seller/${sellerReviewId}] Deleted sellerReviews succesfully!`
      );
      return res.json({
        msg: 'Review deleted',
      });
    } else {
      logger.error(`[DELETE /api/reviews/seller/${sellerReviewId}] Failed`);
      return res.status(400).json({
        err: 'sellerReview could not be deleted',
      });
    }
  }
);

export default router;
