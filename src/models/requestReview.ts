import mongoose, { Schema } from 'mongoose';

import { IRequestReview } from '../types';

const RequestReviewSchema: Schema = new Schema(
  {
    request: { type: Schema.Types.ObjectId, ref: 'Request', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRequestReview>(
  'RequestReview',
  RequestReviewSchema
);
