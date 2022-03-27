import mongoose, { Schema } from 'mongoose';

import { IRequest, requestStatus } from '../types';

const RequestsSchema: Schema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    information: { type: String, required: true },
    status: {
      type: String,
      enum: [
        requestStatus.accepted,
        requestStatus.requested,
        requestStatus.completed,
      ],
      default: requestStatus.requested,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRequest>('Request', RequestsSchema);
