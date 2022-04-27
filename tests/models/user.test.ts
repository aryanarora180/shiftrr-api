import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import User from '../../src/models/user';

describe('Model: User', () => {
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
    const user = new User({
      profilePicture:
        'https://bestprofilepictures.com/wp-content/uploads/2020/06/Anonymous-Profile-Picture-1024x1024.jpg',
      name: 'Aryan Arora',
      username: 'aryanarora180',
      googleId: '123456789',
      email: 'aryan.arora180@gmail.com',
      contactNumber: '8007187941',
      bio: 'I am a developer',
      credits: 100,
      status: 'active',
      role: 'user',
      sellerProfile: {
        domain: 'development',
        skills: ['typescript', 'javascript', 'android', 'kotlin', 'java'],
      },
    });
    await user.save();

    const pageHitInDb = await User.findOne({
      username: 'aryanarora180',
    }).exec();

    expect(pageHitInDb?.profilePicture).toEqual(
      'https://bestprofilepictures.com/wp-content/uploads/2020/06/Anonymous-Profile-Picture-1024x1024.jpg'
    );
    expect(pageHitInDb?.name).toEqual('Aryan Arora');
    expect(pageHitInDb?.username).toEqual('aryanarora180');
    expect(pageHitInDb?.googleId).toEqual('123456789');
    expect(pageHitInDb?.email).toEqual('aryan.arora180@gmail.com');
    expect(pageHitInDb?.contactNumber).toEqual('8007187941');
    expect(pageHitInDb?.bio).toEqual('I am a developer');
    expect(pageHitInDb?.credits).toEqual(100);
    expect(pageHitInDb?.status).toEqual('active');
    expect(pageHitInDb?.role).toEqual('user');
    expect(pageHitInDb?.sellerProfile.domain).toEqual('development');
    expect(pageHitInDb?.sellerProfile.skills).toEqual([
      'typescript',
      'javascript',
      'android',
      'kotlin',
      'java',
    ]);
  });

  it('Should not accept invalid data', async () => {
    const user = new User({
      profilePicture:
        'https://bestprofilepictures.com/wp-content/uploads/2020/06/Anonymous-Profile-Picture-1024x1024.jpg',
      name: 'Aryan Arora',
      username: 'aryanarora180',
      googleId: '123456789',
      email: 'aryan.arora180',
      contactNumber: 8007187941,
      bio: 'I am a developer',
      credits: 100,
      status: 'active',
      role: 'user',
      sellerProfile: {
        domain: 'development',
        skills: ['typescript', 'javascript', 'android', 'kotlin', 'java'],
      },
    });
    user.validate((err) => {
      expect(err).toBeDefined();
    });
  });
});
