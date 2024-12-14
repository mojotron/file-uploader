import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { matchedData } from "express-validator";
// config
import prisma from "../config/prisma/prismaConfig.js";
// errors
import { BadRequestError } from "../errors/index.js";

const sharedFolderView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const { userId } = req.user as { userId: string };

    const selectedFolderData = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        sharedTo: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });

    if (selectedFolderData?.createdById !== userId)
      throw new BadRequestError("current user error");

    return res.status(StatusCodes.OK).render("pages/dashboard-shared-options", {
      selectedFolderData,
      inputValues: {
        email: "",
      },
      validationErrors: [],
    });
  } catch (error) {
    return next(error);
  }
};

const sharedFolderAddCollaborator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const { email } = matchedData(req);
    const { userId } = req.user as { userId: string };

    const collaboratorData = await prisma.user.findUnique({
      where: { email },
    });

    if (collaboratorData === null) throw new BadRequestError("unknown user");

    const selectedFolderData = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    console.log(selectedFolderData);

    if (selectedFolderData === null)
      throw new BadRequestError("unknown folder");

    await prisma.folder.update({
      where: { id: selectedFolderData.id },
      data: {
        sharedTo: {
          connect: {
            id: collaboratorData.id,
          },
        },
      },
    });

    return res
      .status(StatusCodes.OK)
      .redirect(`/dashboard/${folderId}/shared-options`);
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

const sharedFolderToggleSharedGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const { userId } = req.user as { userId: string };

    const selectedFolderData = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (selectedFolderData?.createdById !== userId)
      throw new BadRequestError("not current user");

    if (selectedFolderData?.shared === true) {
      return res.status(StatusCodes.OK).render("pages/dashboard-confirm-box", {
        actionPath: `/dashboard/${folderId}/shared-options/toggle-shared`,
        cancelPath: `/dashboard/${folderId}/shared-options`,
        heading: `Dismantle "${selectedFolderData?.name}" folder shared option`,
        message: `You are about to dismantle shared option for this folder. Collaboration will stop and all files will be destroyed. This action is permanent!`,
        cancelText: `Cancel`,
        acceptText: `Dismantle`,
        danger: false,
      });
    } else {
      return res.status(StatusCodes.OK).render("pages/dashboard-confirm-box", {
        actionPath: `/dashboard/${folderId}/shared-options/toggle-shared`,
        cancelPath: `/dashboard/${folderId}/shared-options`,
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
    const { folderId } = req.params;
    const { userId } = req.user as { userId: string };

    const selectedFolderData = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    if (selectedFolderData?.createdById !== userId)
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
      .redirect(`/dashboard/${selectedFolderData.id}/shared-options`);
  } catch (error) {
    return next(error);
  }
};

const sharedFolderRemoveCollaboratorGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    return next(error);
  }
};

const sharedFolderRemoveCollaboratorPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    return next(error);
  }
};

export {
  sharedFolderView,
  sharedFolderToggleSharedGet,
  sharedFolderToggleSharedPost,
  sharedFolderAddCollaborator,
  sharedFolderRemoveCollaboratorGet,
  sharedFolderRemoveCollaboratorPost,
};
