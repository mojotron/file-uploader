import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const redirectToDashboardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated === true) {
    return res.status(StatusCodes.OK).redirect("/dashboard");
  }
  return next();
};

export default redirectToDashboardMiddleware;
