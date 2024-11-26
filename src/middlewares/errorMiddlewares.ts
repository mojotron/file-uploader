import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/index.js";

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(StatusCodes.NOT_FOUND).render("pages/error", {
    heading: `404 page not found`,
    subheading: `error occurred... `,
    message: `Check that you selected resources correctly, go to previous page or login.`,
  });
};

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(StatusCodes.NOT_FOUND).render("pages/error");
};

export { notFoundMiddleware, errorHandlerMiddleware };
