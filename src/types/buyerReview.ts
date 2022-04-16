import mongoose from 'mongoose';

export default interface IBuyerReview {
  _id: mongoose.Types.ObjectId;
  request: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  comment: string;
  rating: number;
}
