import express from 'express';
import { isLoggedIn, isNotBanned } from '../utils/auth';
import logger from '../utils/logger';
import {
  getAllBuyerReviews,
  createBuyerReview,
  getBuyerReviewById,
  getBuyerReviewsByBuyerUser,
  getBuyerReviewsByPostingUser,
  deleteBuyerReview,
} from '../controllers/buyerReview';

const router = express.Router();

// Get all the BuyerReviews
router.get(
  '/',
  isLoggedIn,
  isNotBanned,
  async (_req: express.Request, res: express.Response) => {
    const getAllReviewsQuery = await getAllBuyerReviews();
    if (getAllReviewsQuery.status) {
      logger.info(
        '[GET /api/reviews/buyer] Got all sellerReviews succesfully!'
      );
      return res.json(getAllReviewsQuery.data);
    } else {
      logger.error('[GET /api/reviews/buyer] Failed');
      return res.status(400).json({
        err: 'Could not fetch all buyerReviews',
      });
    }
  }
);

// Get a specific BuyerReview by ID
router.get(
  '/:buyerReviewId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.buyerReviewId;
    const getReviewQuery = await getBuyerReviewById(id);
    if (getReviewQuery.status) {
      logger.info(
        `[GET /api/reviews/buyer/${id}] Got buyerReview succesfully!`
      );
      return res.json(getReviewQuery.data);
    } else {
      logger.error(`[GET /api/reviews/buyer/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch buyerReview',
      });
    }
  }
);

// Get all the BuyerReview for a specific buyer's user ID
router.get(
  '/ofbuyer/:buyerId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.buyerId;
    const getReviewsQuery = await getBuyerReviewsByBuyerUser(id);
    if (getReviewsQuery.status) {
      logger.info(
        `[GET /api/reviews/buyer/ofbuyer/${id}] Got buyerReviews succesfully!`
      );
      return res.json(getReviewsQuery.data);
    } else {
      logger.error(`[GET /api/reviews/buyer/ofbuyer/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch buyerReviews',
      });
    }
  }
);

// Get all the BuyerReviews made by a specific user ID
router.get(
  '/byuser/:userId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.userId;
    const getReviewsQuery = await getBuyerReviewsByPostingUser(id);
    if (getReviewsQuery.status) {
      logger.info(
        `[GET /api/reviews/buyer/byuser/${id}] Got buyerReviews succesfully!`
      );
      return res.json(getReviewsQuery.data);
    } else {
      logger.error(`[GET /api/reviews/buyer/byuser/${id}] Failed`);
      return res.status(400).json({
        err: 'Unable to fetch buyerReviews',
      });
    }
  }
);

// Create a BuyerReviews (buyer is fetched from the request id)
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
    const createBuyerReviewQuery = await createBuyerReview(
      loggedInUserId,
      request_id,
      comment,
      rating
    );

    if (createBuyerReviewQuery.status) {
      logger.info('[POST /api/reviews/buyer] Created buyerReview succesfully!');
      return res.json(createBuyerReviewQuery.data);
    } else {
      logger.error(`[POST /api/reviews/buyer] Failed`);
      return res.status(400).json({
        err: 'Unable to create buyerReview',
      });
    }
  }
);

// Delete a BuyerReviews. Seller and logged in user's IDs must match.
router.delete(
  '/:buyerReviewId',
  isLoggedIn,
  isNotBanned,
  async (req: express.Request, res: express.Response) => {
    const loggedInUser: any = req.user;
    const userId = loggedInUser.id;

    const buyerReviewId = req.params.buyerReviewId;
    const deleteReviewQuery = await deleteBuyerReview(buyerReviewId, userId);
    if (deleteReviewQuery.status) {
      logger.info(
        `[DELETE /api/reviews/buyer/${buyerReviewId}] Deleted buyerReview succesfully!`
      );
      return res.json({
        msg: 'Review deleted',
      });
    } else {
      logger.error(`[DELETE /api/reviews/buyer/${buyerReviewId}] Failed`);
      return res.status(400).json({
        err: 'buyerReview could not be deleted',
      });
    }
  }
);

export default router;
