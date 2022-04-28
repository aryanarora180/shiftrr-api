import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Service from '../../src/models/service';
import {
  getAllServices,
  getService,
  getServicesOfUser,
  createService,
  updateService,
  deleteService,
} from '../../src/controllers/service';
import User from '../../src/models/user';
import { serializeUser } from 'passport';

describe('Controller: Services', () => {
  let mongoServer: MongoMemoryServer;

  const mockUser = new User({
    profilePicture:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi5.walmartimages.com%2Fasr%2F2db1bfec-fe4b-4ea3-a52b-fd444145eb80_1.87c58bf135feeb90101b460d51a09bc2.jpeg&f=1&nofb=1',
    name: 'Tester',
    username: 'tester',
    googleId: '12345',
    email: 'tester@gmail.com',
    contactNumber: '1234567890',
    bio: 'I test',
    credits: 100,
    status: 'active',
    role: 'user',
    sellerProfile: {
      domain: 'testing',
      skills: ['testing'],
    },
  });

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
    await mockUser.save();
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    }
  });

  it('Should be able to fetch all services', async () => {
    let pageHits = await getAllServices();
    expect(pageHits.status).toBe(true);
    expect(pageHits.data).toBeInstanceOf(Array);
    expect(pageHits.data?.length).toBe(0);

    let service = new Service({
      seller: mockUser._id,
      name: 'Website development',
      description: 'I will develop an awesome website for you',
      image:
        'http://www.azinovatechnologies.com/blog/wp-content/uploads/2016/03/web-development.jpg',
      startingPrice: 5000,
    });
    await service.save();

    pageHits = await getAllServices();
    expect(pageHits.status).toBe(true);
    expect(pageHits.data).toBeInstanceOf(Array);
    expect(pageHits.data?.length).toBe(1);
    expect(pageHits.data?.at(0)?.seller._id).toEqual(mockUser._id);
    expect(pageHits.data?.at(0)?.name).toEqual('Website development');
    expect(pageHits.data?.at(0)?.description).toEqual(
      'I will develop an awesome website for you'
    );
    expect(pageHits.data?.at(0)?.image).toEqual(
      'http://www.azinovatechnologies.com/blog/wp-content/uploads/2016/03/web-development.jpg'
    );
    expect(pageHits.data?.at(0)?.startingPrice).toEqual(5000);

    service = new Service({
      seller: mockUser._id,
      name: 'Android app development',
      description: 'I will develop an awesome Android app for you',
      image:
        'http://www.techglows.com/wp-content/uploads/2014/09/android-app-development.png',
      startingPrice: 5000,
    });
    await service.save();

    pageHits = await getAllServices();
    expect(pageHits.status).toBe(true);
    expect(pageHits.data).toBeInstanceOf(Array);
    expect(pageHits.data?.length).toBe(2);
    expect(pageHits.data?.at(1)?.seller._id).toEqual(mockUser._id);
    expect(pageHits.data?.at(1)?.name).toEqual('Android app development');
    expect(pageHits.data?.at(1)?.description).toEqual(
      'I will develop an awesome Android app for you'
    );
    expect(pageHits.data?.at(1)?.image).toEqual(
      'http://www.techglows.com/wp-content/uploads/2014/09/android-app-development.png'
    );
    expect(pageHits.data?.at(1)?.startingPrice).toBe(5000);
  });

  it('Should be able to fetch a service by ID', async () => {
    const services = await getAllServices();
    const serviceToTestFor = services.data?.at(0);

    const service = await getService(serviceToTestFor?._id.toString() || '');

    expect(service.status).toBe(true);
    expect(service.data).toBeInstanceOf(Object);
    expect(service.data?._id).toEqual(serviceToTestFor?._id);
    expect(service.data?.seller._id).toEqual(serviceToTestFor?.seller._id);
    expect(service.data?.name).toEqual(serviceToTestFor?.name);
    expect(service.data?.description).toEqual(serviceToTestFor?.description);
    expect(service.data?.image).toEqual(serviceToTestFor?.image);
    expect(service.data?.startingPrice).toEqual(
      serviceToTestFor?.startingPrice
    );
  });

  it('Should be able to fetch services from a particular user', async () => {
    const service = new Service({
      seller: new mongoose.Types.ObjectId(),
      name: 'iOS app development',
      description: 'I will develop an awesome iOS app for you',
      image:
        'https://ewizmo.com/wp-content/uploads/2017/09/ios-apps-development-2.png',
      startingPrice: 10000,
    });
    await service.save();

    const services = await getServicesOfUser(mockUser._id.toString());

    expect(services.status).toBe(true);
    expect(services.data).toBeInstanceOf(Array);
    expect(services.data?.length).toBe(2);

    expect(services.data?.at(0)?.seller._id).toEqual(mockUser._id);
    expect(services.data?.at(1)?.seller._id).toEqual(mockUser._id);
  });

  it('Should be able to create a service', async () => {
    let service = await createService(
      mockUser._id.toString(),
      'Flutter development',
      'I will develop an awesome Flutter app for you',
      'https://www.signitysolutions.com/blog/wp-content/uploads/2020/04/Flutter-app-development-signity-solutions.png',
      10
    );

    expect(service.status).toBe(true);
    expect(service.data).toBeInstanceOf(Object);
    expect(service.data?._id).toBeDefined();
    expect(service.data?.seller).toEqual(mockUser._id);
    expect(service.data?.name).toEqual('Flutter development');
    expect(service.data?.description).toEqual(
      'I will develop an awesome Flutter app for you'
    );
    expect(service.data?.image).toEqual(
      'https://www.signitysolutions.com/blog/wp-content/uploads/2020/04/Flutter-app-development-signity-solutions.png'
    );
    expect(service.data?.startingPrice).toBe(10);

    service = await getService(service.data?._id.toString() || '');
    expect(service.status).toBe(true);
    expect(service.data?.seller?._id).toEqual(mockUser._id);
    expect(service.data?.name).toEqual('Flutter development');
    expect(service.data?.description).toEqual(
      'I will develop an awesome Flutter app for you'
    );
    expect(service.data?.image).toEqual(
      'https://www.signitysolutions.com/blog/wp-content/uploads/2020/04/Flutter-app-development-signity-solutions.png'
    );
    expect(service.data?.startingPrice).toBe(10);
  });

  it('Should be able to update a service (only creating user)', async () => {
    const services = await getAllServices();
    const serviceToUpdate = services.data?.at(0);

    const update = {
      name: 'Updated name',
      description: 'Updated description',
      image:
        'https://www.signitysolutions.com/blog/wp-content/uploads/2020/04/Flutter-app-development-signity-solutions.png',
      startingPrice: 100,
    };

    const wrongUserUpdate = await updateService(
      serviceToUpdate?._id.toString() || '',
      new mongoose.Types.ObjectId().toString(),
      update
    );
    expect(wrongUserUpdate.status).toBe(false);

    await updateService(
      serviceToUpdate?._id.toString() || '',
      mockUser._id.toString(),
      update
    );

    const service = await getService(serviceToUpdate?._id.toString() || '');

    expect(service.status).toBe(true);
    expect(service.data).toBeInstanceOf(Object);
    expect(service.data?._id).toEqual(serviceToUpdate?._id);
    expect(service.data?.seller._id).toEqual(mockUser._id);
    expect(service.data?.name).toEqual(update.name);
    expect(service.data?.description).toEqual(update.description);
    expect(service.data?.image).toEqual(update.image);
    expect(service.data?.startingPrice).toEqual(update.startingPrice);
  });

  it('Should be able to delete a service (only creating user)', async () => {
    const services = await getAllServices();
    const serviceToDelete = services.data?.at(0);

    const wrongUserDelete = await deleteService(
      serviceToDelete?._id.toString() || '',
      new mongoose.Types.ObjectId().toString()
    );
    expect(wrongUserDelete.status).toBe(false);

    await deleteService(
      serviceToDelete?._id.toString() || '',
      mockUser._id.toString()
    );

    const service = await getService(serviceToDelete?._id.toString() || '');

    expect(service.status).toBe(false);
  });
});
