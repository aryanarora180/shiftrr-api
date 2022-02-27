import express from 'express';

export function isLoggedIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.isAuthenticated()) return next();

  res.status(401).json({
    err: 'User not logged in',
  });
}
