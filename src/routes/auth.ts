import express from 'express';
import passport from 'passport';
import { isLoggedIn } from '../utils/auth';
import { UI_BASE_URL } from '../utils/constants';

const router = express.Router();

router.get('/google', passport.authenticate('google'));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${UI_BASE_URL}/login/fail`,
    failureMessage: true,
  }),
  (_req: express.Request, res: express.Response) => {
    res.redirect(`${UI_BASE_URL}/profile`);
  }
);

router.get(
  '/google/logout',
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect(`${UI_BASE_URL}`);
  }
);

export default router;
