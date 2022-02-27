import express from 'express';
import { isLoggedIn } from '../utils/auth';

const router = express.Router();

router.get('/', isLoggedIn, (req: express.Request, res: express.Response) => {
  res.json({
    msg: req.user,
  });
});

export default router;
