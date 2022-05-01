import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import RequestReview from '../../src/models/requestReview';

import {
  mockBuyerUser,
  mockSellerUser,
  mockSellerService,
  mockBuyerRequest,
} from '../helpers/review';

describe('Model: RequestReview', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('Should be able to create', async () => {
    const requestReview = new RequestReview({
      request: mockBuyerRequest._id,
      service: mockSellerService._id,
      seller: mockSellerUser._id,
      buyer: mockBuyerUser._id,
      comment: 'Test request review',
      rating: 2.4,
    });
    await requestReview.save();

    const pageHitInDb = await RequestReview.findOne({
      _id: requestReview._id,
    }).exec();

    expect(pageHitInDb?.request).toEqual(mockBuyerRequest._id);
    expect(pageHitInDb?.buyer).toEqual(mockBuyerUser._id);
    expect(pageHitInDb?.seller).toEqual(mockSellerUser._id);
    expect(pageHitInDb?.service).toEqual(mockSellerService._id);
    expect(pageHitInDb?.comment).toEqual('Test request review');
    expect(pageHitInDb?.rating).toEqual(2.4);
  });

  it('Should not accept invalid data', async () => {
    const invalidBuyerReview = new RequestReview({
      request: mockBuyerRequest._id,
      service: mockSellerService._id,
      seller: mockSellerUser._id,
      comment: 'This can be removed',
      rating: 5.3,
    });

    invalidBuyerReview.validate((err) => {
      expect(err).toBeDefined();
    });
  });
});
