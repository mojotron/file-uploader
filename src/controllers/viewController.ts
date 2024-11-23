import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const getIndexView = (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).render("pages/index");
};

const getSignupView = (req: Request, res: Response) => {
  //TODO CHECK AUTH and redirect
  return res.status(StatusCodes.OK).render("pages/signup-form", {
    actionPath: "/signup",
    inputValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

const getLoginView = (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).render("pages/login-form");
};

export { getIndexView, getSignupView, getLoginView };