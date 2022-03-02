import mongoose, { Schema } from 'mongoose';

import { IService } from '@shiftrr/types/models';

const ServiceSchema: Schema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    startingPrice: { type: Number, required: true },
    rating: { type: Number, default: 5, min: 0, max: 5, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IService>('Service', ServiceSchema);
