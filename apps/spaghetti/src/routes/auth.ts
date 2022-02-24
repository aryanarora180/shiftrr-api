import express from 'express';
import passport from 'passport';
import { UI_BASE_URL } from 'src/utils/constants';

const router = express.Router();

router.get('/google', passport.authenticate('google'));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${UI_BASE_URL}/login/fail`,
    failureMessage: true,
  }),
  (_req: express.Request, res: express.Response) => {
    res.redirect(`${UI_BASE_URL}/user`);
  }
);

router.get('/logout', (req: express.Request, res: express.Response) => {
  if (req.user) {
    req.logout();
    res.redirect(`${UI_BASE_URL}`);
  } else {
    res.status(401).json({
      err: 'User not logged in',
    });
  }
});

export default router;
