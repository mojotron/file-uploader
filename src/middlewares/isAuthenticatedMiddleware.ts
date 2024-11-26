import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const isAuthenticatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isUserAuthenticated = req.isAuthenticated();

    if (isUserAuthenticated === true) return next();

    return res.status(StatusCodes.UNAUTHORIZED).redirect("/");
  } catch (error) {
    return next(error);
  }
};

export default isAuthenticatedMiddleware;
