import express from 'express';

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  if (req.user) {
    res.status(200).json({
      msg: req.user,
    });
  } else {
    res.status(401).json({
      err: 'User not logged in',
    });
  }
});

export default router;
