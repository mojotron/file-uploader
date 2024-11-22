import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    return next(error);
  }
};

export { postSignup };
