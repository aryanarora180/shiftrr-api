import mongoose, { Document } from 'mongoose';

import IService from './service';
import IUser from './user';

export default interface IRequest {
  _id: mongoose.Types.ObjectId;
  service: IService;
  seller: IUser;
  buyer: IUser;
  price: number;
  information: string;
  status: number;
}
