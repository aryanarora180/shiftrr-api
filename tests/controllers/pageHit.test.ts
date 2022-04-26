import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import PageHit from '../../src/models/pageHit';
import {
  createPageHit,
  getAllPageHits,
  getPageHitById,
  getPageHitsByUser,
} from '../../src/controllers/pageHit';
import User from '../../src/models/user';

describe('Controller: PageHits', () => {
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

  it('Should be able to fetch all page hits', async () => {
    let pageHits = await getAllPageHits();
    expect(pageHits.status).toBe(true);
    expect(pageHits.data).toBeInstanceOf(Array);
    expect(pageHits.data?.length).toBe(0);

    let pageHit = new PageHit({
      endpoint: 'test/123',
      logicalEndpoint: 'test/number',
      user: mockUser._id,
    });
    await pageHit.save();

    pageHits = await getAllPageHits();
    expect(pageHits.status).toBe(true);
    expect(pageHits.data).toBeInstanceOf(Array);
    expect(pageHits.data?.length).toBe(1);
    expect(pageHits.data?.at(0)?.endpoint).toEqual('test/123');
    expect(pageHits.data?.at(0)?.logicalEndpoint).toEqual('test/number');
    expect(pageHits.data?.at(0)?.user._id).toEqual(mockUser._id);

    pageHit = new PageHit({
      endpoint: 'test/12345',
      logicalEndpoint: 'test/numbers',
      user: mockUser._id,
    });
    await pageHit.save();

    pageHits = await getAllPageHits();
    expect(pageHits.status).toBe(true);
    expect(pageHits.data).toBeInstanceOf(Array);
    expect(pageHits.data?.length).toBe(2);
    expect(pageHits.data?.at(1)?.endpoint).toEqual('test/12345');
    expect(pageHits.data?.at(1)?.logicalEndpoint).toEqual('test/numbers');
    expect(pageHits.data?.at(1)?.user._id).toEqual(mockUser._id);
  });

  it('Should be able to fetch a page hit by ID', async () => {
    const pageHits = await getAllPageHits();
    const pageHitToTestFor = pageHits.data?.at(0);

    const pageHit = await getPageHitById(
      pageHitToTestFor?._id.toString() || ''
    );

    expect(pageHit.status).toBe(true);
    expect(pageHit.data?.endpoint).toEqual(pageHitToTestFor?.endpoint);
    expect(pageHit.data?.logicalEndpoint).toEqual(
      pageHitToTestFor?.logicalEndpoint
    );
    expect(pageHit.data?.user._id).toEqual(pageHitToTestFor?.user._id);
  });

  it('Should be able to fetch a page hit from a particular user', async () => {
    const pageHits = await getPageHitsByUser(mockUser._id.toString());

    expect(pageHits.status).toBe(true);
    expect(pageHits.data).toBeInstanceOf(Array);
    expect(pageHits.data?.length).toBe(2);
    expect(pageHits.data?.at(0)?.endpoint).toEqual('test/123');
    expect(pageHits.data?.at(0)?.logicalEndpoint).toEqual('test/number');
    expect(pageHits.data?.at(0)?.user._id).toEqual(mockUser._id);
    expect(pageHits.data?.at(1)?.endpoint).toEqual('test/12345');
    expect(pageHits.data?.at(1)?.logicalEndpoint).toEqual('test/numbers');
    expect(pageHits.data?.at(1)?.user._id).toEqual(mockUser._id);
  });

  it('Should be able to create a page hit', async () => {
    const pageHit = await createPageHit(
      'test/456',
      'test/number',
      mockUser._id.toString()
    );

    expect(pageHit.status).toBe(true);
    expect(pageHit.data?.endpoint).toBe('test/456');
    expect(pageHit.data?.logicalEndpoint).toBe('test/number');
    expect(pageHit.data?.user._id).toEqual(mockUser._id);
  });
});
