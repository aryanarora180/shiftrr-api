import mongoose from 'mongoose';

export default interface IService {
  _id: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image?: string;
  startingPrice: number;
}
