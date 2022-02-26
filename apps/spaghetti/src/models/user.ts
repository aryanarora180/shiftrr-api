import mongoose, { Schema } from 'mongoose';

import { IUser } from '@shiftrr/types/models';

const SellerSchema: Schema = new Schema(
  {
    services: { type: [Schema.Types.ObjectId], ref: 'Service' },
    skills: { type: [String], default: [] },
    rating: { type: Number, default: 10, min: 0, max: 10 },
    requests: { type: [Schema.Types.ObjectId], ref: 'Request' },
  },
  {
    timestamps: true,
  }
);

const BuyerSchema: Schema = new Schema(
  {
    rating: { type: Number, default: 10, min: 0, max: 10 },
    requested: { type: [Schema.Types.ObjectId], ref: 'Request' },
  },
  {
    timestamps: true,
  }
);

const UserSchema: Schema = new Schema(
  {
    profilePicture: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    googleId: { required: true, type: String },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (email: string) => {
          return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          );
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },
    contactNumber: { type: Number, required: true },
    bio: { type: String, required: true, trim: true },
    credits: { type: String, required: true, trim: true },
    sellerProfile: { type: SellerSchema, required: true },
    buyerProfile: { type: BuyerSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
