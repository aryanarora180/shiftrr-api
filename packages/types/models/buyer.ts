import mongoose, { Document } from 'mongoose';

export default interface IBuyer extends Document {
  rating: number;
  requested: [mongoose.Types.ObjectId];
}
