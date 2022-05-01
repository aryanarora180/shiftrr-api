import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import BuyerReview from '../../src/models/buyerReview';

import {
  mockBuyerUser,
  mockSellerUser,
  mockSellerService,
  mockBuyerRequest,
  mockBuyerReview,
  mockBuyerReview2,
} from '../helpers/review';

import {
  getAllBuyerReviews,
  getBuyerReviewById,
  getBuyerReviewsByBuyerUser,
  getBuyerReviewsByPostingUser,
  createBuyerReview,
  deleteBuyerReview,
} from '../../src/controllers/buyerReview';

describe('Controller: BuyerReview', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await mockBuyerUser.save();
    await mockSellerUser.save();
    await mockSellerService.save();
    await mockBuyerRequest.save();
    await mockBuyerReview.save();
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    }
  });

  it('Should be able to fetch all BuyerReviews', async () => {
    let getAllBuyerReviewsQuery = await getAllBuyerReviews();
    expect(getAllBuyerReviewsQuery.status).toBe(true);
    expect(getAllBuyerReviewsQuery.data).toBeInstanceOf(Array);
    expect(getAllBuyerReviewsQuery.data?.length).toBe(1);
    expect(getAllBuyerReviewsQuery.data?.at(0)?._id).toEqual(
      mockBuyerReview._id
    );

    await mockBuyerReview2.save();

    getAllBuyerReviewsQuery = await getAllBuyerReviews();
    expect(getAllBuyerReviewsQuery.status).toBe(true);
    expect(getAllBuyerReviewsQuery.data).toBeInstanceOf(Array);
    expect(getAllBuyerReviewsQuery.data?.length).toBe(2);
    expect(getAllBuyerReviewsQuery.data?.at(1)?._id).toEqual(
      mockBuyerReview2._id
    );
  });

  it('Should be able to fetch BuyerReview by ID', async () => {
    let getBuyerReviewByIdQuery = await getBuyerReviewById(
      mockBuyerReview._id.toString()
    );
    expect(getBuyerReviewByIdQuery.status).toBe(true);
    expect(getBuyerReviewByIdQuery.data).toBeInstanceOf(BuyerReview);
    expect(getBuyerReviewByIdQuery.data?._id).toEqual(mockBuyerReview._id);
    expect(getBuyerReviewByIdQuery.data?.request._id).toEqual(
      mockBuyerRequest._id
    );
    expect(getBuyerReviewByIdQuery.data?.service._id).toEqual(
      mockSellerService._id
    );
    expect(getBuyerReviewByIdQuery.data?.seller._id).toEqual(
      mockSellerUser._id
    );
    expect(getBuyerReviewByIdQuery.data?.buyer._id).toEqual(mockBuyerUser._id);
    expect(getBuyerReviewByIdQuery.data?.comment).toEqual(
      mockBuyerReview.comment
    );
    expect(getBuyerReviewByIdQuery.data?.rating).toEqual(
      mockBuyerReview.rating
    );
  });

  it('Should be able to fetch BuyerReviews by Buyer User', async () => {
    let getBuyerReviewByIdQuery = await getBuyerReviewsByBuyerUser(
      mockBuyerUser._id.toString()
    );
    expect(getBuyerReviewByIdQuery.status).toBe(true);
    expect(getBuyerReviewByIdQuery.data).toBeInstanceOf(Array);
    expect(getBuyerReviewByIdQuery.data?.length).toBe(2);

    getBuyerReviewByIdQuery = await getBuyerReviewsByBuyerUser(
      mockSellerUser._id.toString()
    );
    expect(getBuyerReviewByIdQuery.status).toBe(true);
    expect(getBuyerReviewByIdQuery.data).toBeInstanceOf(Array);
    expect(getBuyerReviewByIdQuery.data?.length).toBe(0);
  });

  it('Should be able to fetch BuyerReviews by Seller User', async () => {
    let getBuyerReviewByIdQuery = await getBuyerReviewsByPostingUser(
      mockSellerUser._id.toString()
    );
    expect(getBuyerReviewByIdQuery.status).toBe(true);
    expect(getBuyerReviewByIdQuery.data).toBeInstanceOf(Array);
    expect(getBuyerReviewByIdQuery.data?.length).toBe(2);

    getBuyerReviewByIdQuery = await getBuyerReviewsByPostingUser(
      mockBuyerUser._id.toString()
    );
    expect(getBuyerReviewByIdQuery.status).toBe(true);
    expect(getBuyerReviewByIdQuery.data).toBeInstanceOf(Array);
    expect(getBuyerReviewByIdQuery.data?.length).toBe(0);
  });

  it('Should be able to create a BuyerReview', async () => {
    let createBuyerReviewQuery = await createBuyerReview(
      mockSellerUser._id.toString(),
      mockBuyerRequest._id.toString(),
      'Created inside the test',
      3.6
    );

    expect(createBuyerReviewQuery.status).toBe(true);
    expect(createBuyerReviewQuery.data).toBeInstanceOf(BuyerReview);
    expect(createBuyerReviewQuery.data?.request).toEqual(mockBuyerRequest._id);
    expect(createBuyerReviewQuery.data?.service).toEqual(mockSellerService._id);
    expect(createBuyerReviewQuery.data?.seller).toEqual(mockSellerUser._id);
    expect(createBuyerReviewQuery.data?.buyer).toEqual(mockBuyerUser._id);
    expect(createBuyerReviewQuery.data?.comment).toEqual(
      'Created inside the test'
    );
    expect(createBuyerReviewQuery.data?.rating).toEqual(3.6);
  });

  it('Should be able to delete a BuyerReview', async () => {
    let deleteBuyerReviewQuery = await deleteBuyerReview(
      mockBuyerReview._id.toString(),
      mockSellerUser._id.toString()
    );
    expect(deleteBuyerReviewQuery.status).toBe(true);
    let getBuyerReviewByIdQuery = await getBuyerReviewById(
      mockBuyerReview._id.toString()
    );
    expect(getBuyerReviewByIdQuery.status).toBe(false);
  });
});
