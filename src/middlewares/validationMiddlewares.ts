import { NextFunction, Response, Request } from "express";
import { validationResult, Result } from "express-validator";
import { StatusCodes } from "http-status-codes";

// helpers
const getErrorMessages = (result: Result): string[] => {
  return result.array().map((err) => err.msg);
};

const signupValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const validationErrors = getErrorMessages(result);
    return res.status(StatusCodes.BAD_REQUEST).render("pages/signup-form", {
      actionPath: "/signup",
      inputValues: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors,
    });
  }

  return next();
};

export { signupValidationMiddleware };
