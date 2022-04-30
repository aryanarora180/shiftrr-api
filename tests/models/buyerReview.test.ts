import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import BuyerReview from '../../src/models/buyerReview';

import {
  mockBuyerUser,
  mockSellerUser,
  mockSellerService,
  mockBuyerRequest,
} from '../helpers/buyerReview';

describe('Model: BuyerReview', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await mockBuyerUser.save();
    await mockSellerUser.save();
    await mockSellerService.save();
    await mockBuyerRequest.save();
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    }
  });

  it('Should be able to create', async () => {
    const buyerReview = new BuyerReview({
      request: mockBuyerRequest._id,
      service: mockSellerService._id,
      seller: mockSellerUser._id,
      buyer: mockBuyerUser._id,
      comment: 'Nice service',
      rating: 4.2,
    });
    await buyerReview.save();

    const pageHitInDb = await BuyerReview.findOne({
      _id: buyerReview._id,
    }).exec();

    expect(pageHitInDb?.request).toEqual(mockBuyerRequest._id);
    expect(pageHitInDb?.buyer).toEqual(mockBuyerUser._id);
    expect(pageHitInDb?.seller).toEqual(mockSellerUser._id);
    expect(pageHitInDb?.service).toEqual(mockSellerService._id);
    expect(pageHitInDb?.comment).toEqual('Nice service');
    expect(pageHitInDb?.rating).toEqual(4.2);
  });

  it('Should not accept invalid data', async () => {
    const invalidBuyerReview = new BuyerReview({
      request: mockBuyerRequest._id,
      seller: mockSellerUser._id,
      buyer: mockBuyerUser._id,
      comment: 'Nice service',
      rating: 9,
    });

    invalidBuyerReview.validate((err) => {
      expect(err).toBeDefined();
    });
  });
});
