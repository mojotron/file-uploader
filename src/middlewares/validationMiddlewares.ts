import { NextFunction, Response, Request } from "express";
import { validationResult, Result } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma/prismaConfig.js";

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

const folderValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user as { userId: string };
    const { folderName } = req.params; // for checking if folder is created or updated
    const isUpdating = folderName !== undefined;

    const result = validationResult(req);

    // check if user has folder with same name
    const folderExists = await prisma.folder.findFirst({
      where: {
        AND: [{ name: folderName }, { createdById: userId }],
      },
    });

    console.log(folderExists);

    if (!result.isEmpty() || folderExists) {
      const validationErrors = getErrorMessages(result);

      if (folderExists)
        validationErrors.push(
          `current user already have folder with this name`
        );

      return res.status(StatusCodes.OK).render("pages/dashboard-folder-form", {
        actionPath: isUpdating
          ? `/dashboard/${folderName}/edit`
          : `/dashboard/create-folder`,
        update: isUpdating,
        inputValues: {
          folderName: req.body.folderName,
          folderDescription: req.body.folderDescription,
        },
        validationErrors,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export {
  signupValidationMiddleware,
  loginValidationMiddleware,
  folderValidationMiddleware,
};
