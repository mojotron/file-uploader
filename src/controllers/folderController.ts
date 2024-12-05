import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import prisma from "../config/prisma/prismaConfig.js";

// NOTE! READ FOLDER CRUD OPERATION IS IN DASHBOARD CONTROLLER

const createFolderGet = (req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.OK).render("pages/dashboard-folder-form", {
    actionPath: "/dashboard/create-folder",
    update: false,
    inputValues: {
      folderName: "",
      folderDescription: "",
    },
    validationErrors: [],
  });
};

const createFolderPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderName, folderDescription } = matchedData(req);
    const { userId } = req.user as { userId: string };

    const newFolder = await prisma.folder.create({
      data: {
        createdById: userId,
        name: folderName,
        description: folderDescription,
      },
    });

    return res
      .status(StatusCodes.CREATED)
      .redirect(`/dashboard/${newFolder.name}`);
  } catch (error) {
    return next(error);
  }
};

const editFolderGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderName } = req.params;
    const { userId } = req.user as { userId: string };

    const folderData = await prisma.folder.findFirst({
      where: { name: folderName, createdById: userId },
    });

    return res.status(StatusCodes.OK).render("pages/dashboard-folder-form", {
      actionPath: `/dashboard/${folderName}/edit`,
      update: true,
      inputValues: {
        folderName: folderData?.name,
        folderDescription: folderData?.description,
      },
      validationErrors: [],
    });
  } catch (error) {
    return next(error);
  }
};

const editFolderPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oldFolderName = req.params.folderName as string;
    const { folderName, folderDescription } = matchedData(req);
    const { userId } = req.user as { userId: string };

    const folderData = await prisma.folder.findFirst({
      where: { name: oldFolderName, createdById: userId },
    });

    await prisma.folder.update({
      where: { id: folderData?.id },
      data: { name: folderName, description: folderDescription },
    });

    return res.status(StatusCodes.OK).redirect(`/dashboard/${folderName}`);
  } catch (error) {
    return next(error);
  }
};

const deleteFolderGet = (req: Request, res: Response, next: NextFunction) => {
  const { folderName } = req.params;

  return res.status(StatusCodes.OK).render("pages/dashboard-confirm-box", {
    actionPath: `/dashboard/${folderName}/delete`,
    cancelPath: `/dashboard/${folderName}`,
    heading: `Delete folder "${folderName}"`,
    message: `You are about to delete this folder and all files in side. This action is permanent. Do you want to proceed?`,
  });
};

const deleteFolderPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderName } = req.params;
    const { userId } = req.user as { userId: string };

    const folderData = await prisma.folder.findFirst({
      where: { name: folderName, createdById: userId },
    });

    if (folderData === null) {
      throw new BadRequestError(
        `There is no folder with name "${folderName}"!`
      );
    }

    await prisma.folder.delete({
      where: { id: folderData.id },
    });

    return res.status(StatusCodes.OK).redirect("/dashboard");
  } catch (error) {
    return next(error);
  }
};

export {
  createFolderGet,
  createFolderPost,
  editFolderGet,
  editFolderPost,
  deleteFolderGet,
  deleteFolderPost,
};
