import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Folder } from "@prisma/client";
import prisma from "../config/prisma/prismaConfig.js";
import BadRequestError from "../errors/BadRequestError.js";

const getDashboardView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params; // selected folder
    const { userId } = req.user as { userId: string };
    //
    const currentUserData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        folders: {
          select: { name: true, id: true },
        },
        sharedFolders: {
          select: { name: true, id: true },
        },
      },
    });

    let selectedFolderData: Folder | null = null;

    if (folderId !== undefined) {
      const currentUserIsCreator = currentUserData?.folders.find(
        (folder) => folder.id === folderId
      );
      const currentUserIsCollaborator = currentUserData?.sharedFolders.find(
        (folder) => folder.id === folderId
      );

      if (currentUserIsCreator || currentUserIsCollaborator) {
        selectedFolderData = await prisma.folder.findUnique({
          where: { id: folderId },
          include: { files: { select: { id: true, name: true } } },
        });
      } else {
        throw new BadRequestError(
          "selected folder is not connected with current user"
        );
      }
    }

    return res.status(StatusCodes.OK).render("pages/dashboard", {
      currentUser: userId,
      userFolders: currentUserData?.folders,
      sharedFolders: currentUserData?.sharedFolders,
      selectedFolder: folderId || "",
      selectedFolderData,
    });
  } catch (error) {
    console.log("DASHBOARD ERROR");

    console.log(error);

    return next(error);
  }
};

export { getDashboardView };
