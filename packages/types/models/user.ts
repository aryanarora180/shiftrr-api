import mongoose, { Document } from 'mongoose';

import IBuyer from './buyer';
import ISeller from './seller';

export enum userStatus {
  active = 'active',
  banned = 'banned',
}

export enum userRole {
  admin = 'admin',
  user = 'user',
}

export default interface IUser extends Document {
  profilePicture: string;
  name: string;
  username: string;
  googleId: string;
  email: string;
  contactNumber: string;
  bio: string;
  credits: number;
  status: userStatus;
  role: userRole;
  sellerProfile: ISeller;
  buyerProfile: IBuyer;
}
