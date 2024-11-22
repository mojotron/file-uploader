import { NextFunction, Response, Request } from "express";

const signupValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next();
};

export { signupValidationMiddleware };
