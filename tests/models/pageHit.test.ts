import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import PageHit from '../../src/models/pageHit';

describe('Model: PageHits', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    }
  });

  it('Should be able to create', async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const pageHit = new PageHit({
      endpoint: 'test/123',
      logicalEndpoint: 'test/number',
      user: mockUserId,
    });
    await pageHit.save();

    const pageHitInDb = await PageHit.findOne({ endpoint: 'test/123' }).exec();

    expect(pageHitInDb?.endpoint).toEqual('test/123');
    expect(pageHitInDb?.logicalEndpoint).toEqual('test/number');
    expect(pageHitInDb?.user).toEqual(mockUserId);
  });

  it('Should not accept invalid data', async () => {
    const pageHit = new PageHit({
      endpoint: 123,
      logicalEndpoint: 'test/number',
      user: 'mockUserId',
    });
    pageHit.validate((err) => {
      expect(err).toBeDefined();
    });
  });
});
