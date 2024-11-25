import { NextFunction, Response, Request } from "express";
import { validationResult, Result } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// helpers
const getErrorMessages = (result: Result): string[] => {
  return result.array().map((err) => err.msg);
};

const signupValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usernameExists = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    const emailExists = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    const result = validationResult(req);

    if (usernameExists || emailExists || !result.isEmpty()) {
      const validationErrors = getErrorMessages(result);
      if (usernameExists) validationErrors.push("username already exists");
      if (emailExists) validationErrors.push("email already in use");

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
  } catch (error) {
    return next(error);
  }
};

const loginValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const validationErrors = getErrorMessages(result);

    return res.status(StatusCodes.OK).render("pages/login-form", {
      actionPath: "/login",
      inputValues: {
        email: req.body.email,
        password: req.body.password,
      },
      validationErrors,
    });
  }

  return next();
};

export { signupValidationMiddleware, loginValidationMiddleware };
