import { IUser } from '../../types';
import User from '../../models/user';
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
} from '../constants';
const GoogleStrategy = require('passport-google-oauth20');

export const GoogleOAuthStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email'],
  },
  function (_: any, __: any, profile: any, cb: any) {
    User.findOne({ googleId: profile.id }, async (err: Error, doc: IUser) => {
      if (err) {
        return cb(err, null);
      }
      if (!doc) {
        const newUser = new User({
          profilePicture: profile.photos[0].value,
          name: profile.displayName,
          username:
            `${profile.name.givenName}.${profile.name.familyName}`.toLowerCase(),
          googleId: profile.id,
          email: profile.emails[0].value,
          contactNumber: '',
          bio: '',
          credits: 1000,
          sellerProfile: {
            services: [],
            skills: [],
            requests: [],
            domain: '',
          },
          buyerProfile: {
            requested: [],
          },
        });
        await newUser.save();
        cb(null, newUser);
      } else {
        cb(null, doc);
      }
    });
  }
);
