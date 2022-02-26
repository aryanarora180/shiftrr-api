import mongoose, { Schema } from 'mongoose';

import { IRequest } from '@shiftrr/types/models';

const RequestsSchema: Schema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    buyer: { type: Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, required: true },
    status: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRequest>('Request', RequestsSchema);
