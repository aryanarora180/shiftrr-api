import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import RequestReview from '../../src/models/requestReview';

import {
  mockBuyerUser,
  mockSellerUser,
  mockSellerService,
  mockBuyerRequest,
  mockRequestReview,
  mockRequestReview2,
} from '../helpers/review';

import {
  getAllRequestReviews,
  getRequestReviewById,
  getRequestReviewsByRequest,
  getRequestReviewsByService,
  getRequestReviewsByBuyer,
  createRequestReview,
  deleteRequestReview,
} from '../../src/controllers/requestReview';

describe('Controller: RequestReview', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await mockBuyerUser.save();
    await mockSellerUser.save();
    await mockSellerService.save();
    await mockBuyerRequest.save();
    await mockRequestReview.save();
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    }
  });

  it('Should be able to fetch all RequestReviews', async () => {
    let getAllRequestReviewsQuery = await getAllRequestReviews();
    expect(getAllRequestReviewsQuery.status).toBe(true);
    expect(getAllRequestReviewsQuery.data).toBeInstanceOf(Array);
    expect(getAllRequestReviewsQuery.data?.length).toBe(1);
    expect(getAllRequestReviewsQuery.data?.at(0)?._id).toEqual(
      mockRequestReview._id
    );

    await mockRequestReview2.save();

    getAllRequestReviewsQuery = await getAllRequestReviews();
    expect(getAllRequestReviewsQuery.status).toBe(true);
    expect(getAllRequestReviewsQuery.data).toBeInstanceOf(Array);
    expect(getAllRequestReviewsQuery.data?.length).toBe(2);
    expect(getAllRequestReviewsQuery.data?.at(1)?._id).toEqual(
      mockRequestReview2._id
    );
  });

  it('Should be able to fetch RequestReview by ID', async () => {
    let getRequestReviewByIdQuery = await getRequestReviewById(
      mockRequestReview._id.toString()
    );
    expect(getRequestReviewByIdQuery.status).toBe(true);
    expect(getRequestReviewByIdQuery.data).toBeInstanceOf(RequestReview);
    expect(getRequestReviewByIdQuery.data?._id).toEqual(mockRequestReview._id);
    expect(getRequestReviewByIdQuery.data?.request._id).toEqual(
      mockBuyerRequest._id
    );
    expect(getRequestReviewByIdQuery.data?.service._id).toEqual(
      mockSellerService._id
    );
    expect(getRequestReviewByIdQuery.data?.seller._id).toEqual(
      mockSellerUser._id
    );
    expect(getRequestReviewByIdQuery.data?.buyer._id).toEqual(
      mockBuyerUser._id
    );
    expect(getRequestReviewByIdQuery.data?.comment).toEqual(
      mockRequestReview.comment
    );
    expect(getRequestReviewByIdQuery.data?.rating).toEqual(
      mockRequestReview.rating
    );
  });

  it('Should be able to fetch RequestReviews by Request', async () => {
    let getRequestReviewsByRequestQuery = await getRequestReviewsByRequest(
      mockBuyerRequest._id.toString()
    );
    expect(getRequestReviewsByRequestQuery.status).toBe(true);
    expect(getRequestReviewsByRequestQuery.data).toBeInstanceOf(Array);
    expect(getRequestReviewsByRequestQuery.data?.length).toBe(2);
    expect(getRequestReviewsByRequestQuery.data?.at(0)?._id).toStrictEqual(
      mockRequestReview._id
    );
    expect(getRequestReviewsByRequestQuery.data?.at(1)?._id).toStrictEqual(
      mockRequestReview2._id
    );

    getRequestReviewsByRequestQuery = await getRequestReviewsByRequest(
      mockSellerUser._id.toString()
    );
    expect(getRequestReviewsByRequestQuery.status).toBe(true);
    expect(getRequestReviewsByRequestQuery.data).toBeInstanceOf(Array);
    expect(getRequestReviewsByRequestQuery.data?.length).toBe(0);
  });

  it('Should be able to fetch RequestReviews by Service', async () => {
    let getRequestReviewsByServiceQuery = await getRequestReviewsByService(
      mockSellerService._id.toString()
    );
    expect(getRequestReviewsByServiceQuery.status).toBe(true);
    expect(getRequestReviewsByServiceQuery.data).toBeInstanceOf(Array);
    expect(getRequestReviewsByServiceQuery.data?.length).toBe(2);
    expect(getRequestReviewsByServiceQuery.data?.at(0)?._id).toStrictEqual(
      mockRequestReview._id
    );
    expect(getRequestReviewsByServiceQuery.data?.at(1)?._id).toStrictEqual(
      mockRequestReview2._id
    );

    getRequestReviewsByServiceQuery = await getRequestReviewsByRequest(
      mockSellerUser._id.toString()
    );
    expect(getRequestReviewsByServiceQuery.status).toBe(true);
    expect(getRequestReviewsByServiceQuery.data).toBeInstanceOf(Array);
    expect(getRequestReviewsByServiceQuery.data?.length).toBe(0);
  });

  it('Should be able to fetch RequestReviews by Buyer', async () => {
    let getRequestReviewsByBuyerQuery = await getRequestReviewsByBuyer(
      mockBuyerUser._id.toString()
    );
    expect(getRequestReviewsByBuyerQuery.status).toBe(true);
    expect(getRequestReviewsByBuyerQuery.data).toBeInstanceOf(Array);
    expect(getRequestReviewsByBuyerQuery.data?.length).toBe(2);
    expect(getRequestReviewsByBuyerQuery.data?.at(0)?._id).toStrictEqual(
      mockRequestReview._id
    );
    expect(getRequestReviewsByBuyerQuery.data?.at(1)?._id).toStrictEqual(
      mockRequestReview2._id
    );

    getRequestReviewsByBuyerQuery = await getRequestReviewsByRequest(
      mockSellerUser._id.toString()
    );
    expect(getRequestReviewsByBuyerQuery.status).toBe(true);
    expect(getRequestReviewsByBuyerQuery.data).toBeInstanceOf(Array);
    expect(getRequestReviewsByBuyerQuery.data?.length).toBe(0);
  });

  it('Should be able to create a RequestReview', async () => {
    let createRequestReviewQuery = await createRequestReview(
      mockBuyerRequest._id.toString(),
      'Request Review created inside the test',
      1.3
    );
    expect(createRequestReviewQuery.status).toBe(true);

    let checkRequestReview = await RequestReview.findOne({
      _id: createRequestReviewQuery.data?._id,
    });

    expect(checkRequestReview).toBeInstanceOf(RequestReview);
    expect(checkRequestReview?.request).toEqual(mockBuyerRequest._id);
    expect(checkRequestReview?.service).toEqual(mockSellerService._id);
    expect(checkRequestReview?.seller).toEqual(mockSellerUser._id);
    expect(checkRequestReview?.buyer).toEqual(mockBuyerUser._id);
    expect(checkRequestReview?.comment).toEqual(
      'Request Review created inside the test'
    );
    expect(checkRequestReview?.rating).toEqual(1.3);
  });

  it('Should be able to delete a RequestReview', async () => {
    let deleteRequestReviewQuery = await deleteRequestReview(
      mockRequestReview._id.toString(),
      mockBuyerUser._id.toString()
    );
    expect(deleteRequestReviewQuery.status).toBe(true);

    let getRequestReviewByIdQuery = await getRequestReviewById(
      mockRequestReview._id.toString()
    );
    expect(getRequestReviewByIdQuery.status).toBe(false);
  });
});
