import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Request from '../../src/models/request';

import {
  mockBuyerUser,
  mockSellerUser,
  mockSellerService,
} from '../helpers/review';

describe('Model: Request', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await mockBuyerUser.save();
    await mockSellerUser.save();
    await mockSellerService.save();
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    }
  });

  it('Should be able to create', async () => {
    const request = new Request({
      service: mockSellerService._id,
      buyer: mockBuyerUser._id,
      seller: mockSellerUser._id,
      price: 42,
      information: 'This is a test request',
    });
    await request.save();

    const pageHitInDb = await Request.findOne({
      _id: request._id,
    }).exec();

    expect(pageHitInDb?.service).toEqual(mockSellerService._id);
    expect(pageHitInDb?.buyer).toEqual(mockBuyerUser._id);
    expect(pageHitInDb?.seller).toEqual(mockSellerUser._id);
    expect(pageHitInDb?.price).toEqual(42);
    expect(pageHitInDb?.information).toEqual('This is a test request');
  });

  it('Should not accept invalid data', async () => {
    const request = new Request({
      service: mockSellerService._id,
      buyer: mockBuyerUser._id,
      seller: mockSellerUser._id,
    });
    request.validate((err) => {
      expect(err).toBeDefined();
    });
  });
});
