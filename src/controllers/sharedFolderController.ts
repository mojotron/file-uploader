import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// config
import prisma from "../config/prisma/prismaConfig.js";
// errors
import BadRequestError from "../errors/BadRequestError.js";

const sharedFolderView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderName } = req.params;
    const { userId } = req.user as { userId: string };

    const selectedFolderData = await prisma.folder.findFirst({
      where: { name: folderName, createdById: userId },
    });

    return res.status(StatusCodes.OK).render("pages/dashboard-shared-options", {
      selectedFolderData,
    });
  } catch (error) {
    return next(error);
  }
};

const sharedFolderToggleSharedGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderName } = req.params;
    const { userId } = req.user as { userId: string };

    const selectedFolderData = await prisma.folder.findFirst({
      where: { name: folderName, createdById: userId },
    });

    if (selectedFolderData?.shared === true) {
      return res.status(StatusCodes.OK).render("pages/dashboard-confirm-box", {
        actionPath: `/dashboard/${folderName}/shared-options/toggle-shared`,
        cancelPath: `/dashboard/${selectedFolderData?.name}/shared-options`,
        heading: `Dismantle "${selectedFolderData?.name}" folder shared option`,
        message: `You are about to dismantle shared option for this folder. Collaboration will stop and all files will be destroyed. This action is permanent!`,
        cancelText: `Cancel`,
        acceptText: `Dismantle`,
        danger: false,
      });
    } else {
      return res.status(StatusCodes.OK).render("pages/dashboard-confirm-box", {
        actionPath: `/dashboard/${folderName}/shared-options/toggle-shared`,
        cancelPath: `/dashboard/${selectedFolderData?.name}/shared-options`,
        heading: `Make "${selectedFolderData?.name}" folder shared`,
        message: `You are about to make this folder shared. You can invite other users to collaborate with you and share files. Yo can always dismantle shared folder!`,
        cancelText: `Cancel`,
        acceptText: `Make shared`,
        danger: false,
      });
    }
  } catch (error) {
    return next(error);
  }
};

const sharedFolderToggleSharedPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderName } = req.params;
    const { userId } = req.user as { userId: string };

    const selectedFolderData = await prisma.folder.findFirst({
      where: { name: folderName, createdById: userId },
      include: { files: true },
    });
    if (selectedFolderData === null)
      throw new BadRequestError("no folder found");

    if (selectedFolderData.shared === false) {
      await prisma.folder.update({
        where: { id: selectedFolderData.id },
        data: { shared: true },
      });
    } else {
      await prisma.folder.update({
        where: { id: selectedFolderData.id },
        data: { shared: false },
      });
    }
    return res
      .status(StatusCodes.OK)
      .redirect(`/dashboard/${selectedFolderData.name}/shared-options`);
  } catch (error) {
    return next(error);
  }
};

export {
  sharedFolderView,
  sharedFolderToggleSharedGet,
  sharedFolderToggleSharedPost,
};
