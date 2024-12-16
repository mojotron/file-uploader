import { NextFunction, Response, Request } from "express";
import { validationResult, Result, matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma/prismaConfig.js";
import { name } from "ejs";

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
    const { folderName } = req.body; // for checking if folder is created or updated
    const { folderId } = req.params;

    const result = validationResult(req);

    // check if user has folder with same name
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: { folders: true, sharedFolders: true },
    });

    const folderExists = userData?.folders.find(
      (folder) => folder.name === folderName
    );

    if (!result.isEmpty() || folderExists) {
      const validationErrors = getErrorMessages(result);

      if (folderExists)
        validationErrors.push(
          `current user already have folder with this name`
        );

      const isUpdating = folderId !== undefined;

      return res.status(StatusCodes.OK).render("pages/dashboard-folder-form", {
        actionPath: isUpdating
          ? `/dashboard/${folderId}/edit`
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

const collaboratorValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const { userId } = req.user as { userId: string };
    const { email } = req.body;

    const selectedFolderData = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { sharedTo: true },
    });

    // check if email is current user, exists or already collaborator
    const alreadyCollaborator = selectedFolderData?.sharedTo.find(
      (user) => user.email === email
    );
    const collaboratorData = await prisma.user.findUnique({
      where: { email: email },
    });
    const currentUser = collaboratorData?.id === userId;

    const result = validationResult(req);

    if (
      !result.isEmpty() ||
      currentUser ||
      alreadyCollaborator ||
      collaboratorData === null
    ) {
      const validationErrors = getErrorMessages(result);
      if (currentUser)
        validationErrors.push("folder creator cannot be collaborator");
      if (alreadyCollaborator)
        validationErrors.push("given email is already collaborator");
      if (collaboratorData === null)
        validationErrors.push("given email is not application user");

      return res
        .status(StatusCodes.OK)
        .render("pages/dashboard-shared-options", {
          selectedFolderData,
          inputValues: {
            email: req.body.email,
          },
          validationErrors,
        });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const fileValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const validationErrors = getErrorMessages(result);

      const folderData = await prisma.folder.findUnique({
        where: { id: folderId },
        select: { name: true },
      });

      return res
        .status(StatusCodes.BAD_REQUEST)
        .render("pages/dashboard-file-form", {
          currentFolder: folderData?.name,
          actionPath: `/dashboard/${folderId}/upload-file`,
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
  collaboratorValidationMiddleware,
  fileValidationMiddleware,
};
