import mongoose from 'mongoose';

export const enum requestStatus {
  requested = 'requested',
  accepted = 'accepted',
  completed = 'completed',
}

export default interface IRequest {
  _id: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  price: number;
  information: string;
  status: requestStatus;
}
