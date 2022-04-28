import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Service from '../../src/models/service';

describe('Model: Service', () => {
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
    const service = new Service({
      seller: mockUserId,
      name: 'Website development',
      description: 'I will develop an awesome website for you',
      image:
        'http://www.azinovatechnologies.com/blog/wp-content/uploads/2016/03/web-development.jpg',
      startingPrice: 5000,
    });
    await service.save();

    const serviceInDb = await Service.findOne({ seller: mockUserId }).exec();

    expect(serviceInDb?.seller).toEqual(mockUserId);
    expect(serviceInDb?.name).toEqual('Website development');
    expect(serviceInDb?.description).toEqual(
      'I will develop an awesome website for you'
    );
    expect(serviceInDb?.image).toEqual(
      'http://www.azinovatechnologies.com/blog/wp-content/uploads/2016/03/web-development.jpg'
    );
    expect(serviceInDb?.startingPrice).toEqual(5000);
  });

  it('Should not accept invalid data', async () => {
    const service = new Service({
      seller: 123,
      name: 123,
      description: 123,
      image: 123,
      startingPrice: '5,000',
    });
    service.validate((err) => {
      expect(err).toBeDefined();
    });
  });
});
