import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/index.js";

const isAuthenticatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isUserAuthenticated = req.isAuthenticated();
    if (isUserAuthenticated === true) return next();
    else throw new UnauthorizedError();
  } catch (error) {
    return next(error);
  }
};

export default isAuthenticatedMiddleware;
