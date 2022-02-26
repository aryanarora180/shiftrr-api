import mongoose, { Document } from 'mongoose';

import IBuyer from './buyer';
import ISeller from './seller';

export default interface IUser extends Document {
  profilePicture: string;
  name: string;
  username: string;
  googleId: string;
  email: string;
  contactNumber: number;
  bio: string;
  credits: string;
  sellerProfile: ISeller;
  buyerProfile: IBuyer;
}
