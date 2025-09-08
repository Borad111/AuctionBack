import * as Sentry from "@sentry/node";
import { Request, Response, NextFunction } from "express";

export function sentryUserContext(req: Request, _res: Response, next: NextFunction) {
  if (req.user) {
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
    });
  }
  next();
}
