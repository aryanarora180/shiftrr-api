import User from '../../src/models/user';
import Service from '../../src/models/service';
import Request from '../../src/models/request';
import BuyerReview from '../../src/models/buyerReview';
import sellerReview from '../../src/models/sellerReview';
import requestReview from '../../src/models/requestReview';

export const mockBuyerUser = new User({
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

export const mockSellerUser = new User({
  profilePicture:
    'https://bestprofilepictures.com/wp-content/uploads/2020/06/Anonymous-Profile-Picture-1024x1024.jpg',
  name: 'Tushar Chenan',
  username: 'tushie',
  googleId: '987654321',
  email: 'tushar.chenan@gmail.com',
  contactNumber: '1122334455',
  bio: 'I am a koder',
  credits: 100,
  status: 'active',
  role: 'user',
  sellerProfile: {
    domain: 'competitive coding',
    skills: ['c++', 'python'],
  },
});

export const mockSellerService = new Service({
  seller: mockSellerUser._id,
  name: 'Test Service',
  description: 'This is a test service',
  startingPrice: 42,
});

export const mockBuyerRequest = new Request({
  service: mockSellerService._id,
  buyer: mockBuyerUser._id,
  seller: mockSellerUser._id,
  price: 43,
  information: 'Please get this done fast',
});

export const mockBuyerRequest2 = new Request({
  service: mockSellerService._id,
  buyer: mockBuyerUser._id,
  seller: mockSellerUser._id,
  price: 95,
  information: 'Second mock buyer request',
});

export const mockBuyerReview = new BuyerReview({
  request: mockBuyerRequest._id,
  service: mockSellerService._id,
  seller: mockSellerUser._id,
  buyer: mockBuyerUser._id,
  comment: 'First buyer review',
  rating: 3.2,
});

export const mockBuyerReview2 = new BuyerReview({
  request: mockBuyerRequest._id,
  service: mockSellerService._id,
  seller: mockSellerUser._id,
  buyer: mockBuyerUser._id,
  comment: 'Second buyer review',
  rating: 4.3,
});

export const mockSellerReview = new sellerReview({
  request: mockBuyerRequest._id,
  service: mockSellerService._id,
  seller: mockSellerUser._id,
  buyer: mockBuyerUser._id,
  comment: 'First seller review',
  rating: 2.5,
});

export const mockSellerReview2 = new sellerReview({
  request: mockBuyerRequest._id,
  service: mockSellerService._id,
  seller: mockSellerUser._id,
  buyer: mockBuyerUser._id,
  comment: 'Second seller review',
  rating: 4.8,
});

export const mockRequestReview = new requestReview({
  request: mockBuyerRequest._id,
  service: mockSellerService._id,
  seller: mockSellerUser._id,
  buyer: mockBuyerUser._id,
  comment: 'First request review',
  rating: 3.4,
});

export const mockRequestReview2 = new requestReview({
  request: mockBuyerRequest._id,
  service: mockSellerService._id,
  seller: mockSellerUser._id,
  buyer: mockBuyerUser._id,
  comment: 'Second request review',
  rating: 1.3,
});
