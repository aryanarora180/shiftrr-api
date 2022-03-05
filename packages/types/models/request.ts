import mongoose, { Document } from 'mongoose';

import IService from './service';
import IUser from './user';

export enum requestStatus {
  requested = 'requested',
  accepted = 'accepted',
}

export default interface IRequest {
  _id: mongoose.Types.ObjectId;
  service: IService;
  seller: IUser;
  buyer: IUser;
  price: number;
  information: string;
  status: requestStatus;
}
