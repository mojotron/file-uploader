import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const getIndexView = (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).render("pages/index");
};

const getSignupView = (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).render("pages/signup-form");
};

const getLoginView = (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).render("pages/login-form");
};

export { getIndexView, getSignupView, getLoginView };
