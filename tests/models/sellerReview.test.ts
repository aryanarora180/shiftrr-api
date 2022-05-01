import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import SellerReview from '../../src/models/sellerReview';

import {
  mockBuyerUser,
  mockSellerUser,
  mockSellerService,
  mockBuyerRequest,
} from '../helpers/review';

describe('Model: SellerReview', () => {
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
    const sellerReview = new SellerReview({
      request: mockBuyerRequest._id,
      service: mockSellerService._id,
      seller: mockSellerUser._id,
      buyer: mockBuyerUser._id,
      comment: 'Nice seller and service',
      rating: 4.6,
    });
    await sellerReview.save();

    const pageHitInDb = await SellerReview.findOne({
      _id: sellerReview._id,
    }).exec();

    expect(pageHitInDb?.request).toEqual(mockBuyerRequest._id);
    expect(pageHitInDb?.buyer).toEqual(mockBuyerUser._id);
    expect(pageHitInDb?.seller).toEqual(mockSellerUser._id);
    expect(pageHitInDb?.service).toEqual(mockSellerService._id);
    expect(pageHitInDb?.comment).toEqual('Nice seller and service');
    expect(pageHitInDb?.rating).toEqual(4.6);
  });

  it('Should not accept invalid data', async () => {
    const invalidSellerReview = new SellerReview({
      request: mockBuyerRequest._id,
      seller: mockSellerUser._id,
      buyer: mockBuyerUser._id,
      rating: 10,
    });

    invalidSellerReview.validate((err) => {
      expect(err).toBeDefined();
    });
  });
});
