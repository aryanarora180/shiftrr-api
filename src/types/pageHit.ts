import mongoose from 'mongoose';

export default interface IPageHit {
  _id: mongoose.Types.ObjectId;
  endpoint: string;
  logicalEndpoint: string;
  user: mongoose.Types.ObjectId;
}
