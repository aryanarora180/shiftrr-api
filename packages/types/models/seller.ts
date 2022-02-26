import mongoose, { Document } from 'mongoose';

export default interface ISeller extends Document {
  services: [mongoose.Types.ObjectId];
  domain: string;
  skills: string[];
  rating: number;
  requests: [mongoose.Types.ObjectId];
}
