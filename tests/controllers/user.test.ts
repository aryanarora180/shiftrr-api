import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import User from '../../src/models/user';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../../src/controllers/user';

describe('Controller: User', () => {
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
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    }
  });

  it('Should be able to fetch all users', async () => {
    let users = await getAllUsers();
    expect(users.status).toBe(true);
    expect(users.data).toBeInstanceOf(Array);
    expect(users.data?.length).toBe(0);

    await mockUser.save();

    users = await getAllUsers();
    expect(users.status).toBe(true);
    expect(users.data).toBeInstanceOf(Array);
    expect(users.data?.length).toBe(1);
    expect(users.data?.at(0)?.username).toEqual(mockUser.username);
  });

  it('Should be able to fetch a page hit by ID', async () => {
    const users = await getAllUsers();
    const userToTestFor = users.data?.at(0);

    const user = await getUser(userToTestFor?._id.toString() || '');

    expect(user.status).toBe(true);
    expect(user.data).toBeInstanceOf(Object);
    expect(user.data?._id).toEqual(userToTestFor?._id);
    expect(user.data?.username).toEqual(userToTestFor?.username);
    expect(user.data?.email).toEqual(userToTestFor?.email);
    expect(user.data?.contactNumber).toEqual(userToTestFor?.contactNumber);
    expect(user.data?.bio).toEqual(userToTestFor?.bio);
    expect(user.data?.credits).toEqual(userToTestFor?.credits);
    expect(user.data?.status).toEqual(userToTestFor?.status);
    expect(user.data?.role).toEqual(userToTestFor?.role);
    expect(user.data?.sellerProfile.domain).toEqual(
      userToTestFor?.sellerProfile.domain
    );
    expect(user.data?.sellerProfile.skills).toEqual(
      userToTestFor?.sellerProfile.skills
    );
  });

  it('Should be able to update a user', async () => {
    const update = {
      profilePicture:
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ftrendsinusa.com%2Fwp-content%2Fuploads%2F2018%2F01%2FAnonymous-hacker-profile-picture.jpg&f=1&nofb=1',
      name: 'Updated Tester',
      username: 'updatedTester',
      credits: 0,
      status: 'inactive',
      sellerProfile: {
        skills: ['updated'],
      },
    };
    await updateUser(mockUser._id.toString(), update);

    const user = await getUser(mockUser._id.toString());

    expect(user.status).toBe(true);
    expect(user.data).toBeInstanceOf(Object);
    expect(user.status).toBe(true);
    expect(user.data?.profilePicture).toEqual(update.profilePicture);
    expect(user.data?.name).toEqual(update.name);
    expect(user.data?.username).toEqual(update.username);
    expect(user.data?.credits).toEqual(update.credits);
    expect(user.data?.status).toEqual(update.status);
    expect(user.data?.sellerProfile.skills).toEqual(
      update.sellerProfile.skills
    );
  });

  it('Should be able to delete a user', async () => {
    await deleteUser(mockUser._id.toString());

    const user = await getUser(mockUser._id.toString());

    expect(user.status).toBe(false);
  });
});
