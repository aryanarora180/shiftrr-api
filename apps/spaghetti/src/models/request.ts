import mongoose, { Schema } from 'mongoose';

import { IRequest } from '@shiftrr/types/models';
import { requestStatus } from '@shiftrr/types/models/request';

const RequestsSchema: Schema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    information: { type: String, required: true },
    status: {
      type: String,
      enum: [requestStatus.accepted, requestStatus.requested],
      default: requestStatus.requested,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRequest>('Request', RequestsSchema);
