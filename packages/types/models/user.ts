import mongoose, { Document } from 'mongoose';

import IBuyer from './buyer';
import ISeller from './seller';

export default interface IUser extends Document {
  profilePicture: string;
  name: string;
  username: string;
  googleId: string;
  email: string;
  contactNumber: string;
  bio: string;
  credits: number;
  sellerProfile: ISeller;
  buyerProfile: IBuyer;
}
