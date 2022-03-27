import mongoose, { Schema } from 'mongoose';

import { IUser } from '../types';
import { userRole, userStatus } from '../types/user';

const SellerSchema: Schema = new Schema(
  {
    domain: { type: String },
    skills: [{ type: String, default: '' }],
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
    contactNumber: { type: String },
    bio: { type: String, trim: true },
    credits: { type: Number, required: true, trim: true },
    status: {
      type: String,
      enum: [userStatus.active, userStatus.banned],
      default: userStatus.active,
      required: true,
    },
    role: {
      type: String,
      enum: [userRole.admin, userRole.user],
      default: userRole.user,
      required: true,
    },
    sellerProfile: { type: SellerSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
