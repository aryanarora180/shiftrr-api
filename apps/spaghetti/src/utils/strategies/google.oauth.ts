import User from '../../models/User';
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
    scope: ['profile'],
  },
  function (_: any, __: any, profile: any, cb: any) {
    User.findOne(
      { googleId: profile.id },
      // TODO: Change doc to IMongoDBUser interface
      async (err: Error, doc: any) => {
        if (err) {
          return cb(err, null);
        }
        if (!doc) {
          const newUser = new User({
            googleId: profile.id,
            username: profile.name.givenName + '.' + profile.name.familyName,
          });
          await newUser.save();
          cb(null, newUser);
        } else {
          cb(null, doc);
        }
      }
    );
  }
);
