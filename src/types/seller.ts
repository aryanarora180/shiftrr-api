import mongoose from 'mongoose';

export default interface ISeller {
  _id: mongoose.Types.ObjectId;
  domain?: string;
  skills?: string[];
}
