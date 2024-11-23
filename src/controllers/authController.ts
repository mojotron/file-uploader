import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, confirmPassword } = matchedData(req);

    res.json({ username, email, password, confirmPassword });
  } catch (error) {
    return next(error);
  }
};

export { postSignup };
