import mongoose, { Schema } from 'mongoose';

import { IPageHit } from '../types';

const PageHitSchema: Schema = new Schema(
  {
    endpoint: { type: String, required: true, trim: true },
    logicalEndpoint: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPageHit>('PageHit', PageHitSchema);
