import express from 'express';

import { userStatus } from '@shiftrr/types/models';

export function isLoggedIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    err: 'User not logged in',
  });
}

export function isNotBanned(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.isAuthenticated()) {
    const user: any = req.user;
    if (user.status !== userStatus.banned) {
      return next();
    } else {
      res.status(401).json({
        err: 'User banned',
      });
    }
  }
  res.status(401).json({
    err: 'Authorized user not logged in',
  });
}

export function isAdminLoggedIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.isAuthenticated()) {
    const user: any = req.user;
    if (user.role === 'admin') {
      return next();
    }
  }
  res.status(401).json({
    err: 'Authorized user not logged in',
  });
}
