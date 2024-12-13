import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Folder } from "@prisma/client";
import prisma from "../config/prisma/prismaConfig.js";

const getDashboardView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderName } = req.params; // selected folder
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

    // console.log(currentUserData);

    let selectedFolderData: Folder | null = null;

    if (folderName !== undefined) {
      selectedFolderData = await prisma.folder.findFirst({
        where: { name: folderName },
        include: { files: { select: { id: true, name: true } } },
      });
    }

    return res.status(StatusCodes.OK).render("pages/dashboard", {
      currentUser: userId,
      userFolders: currentUserData?.folders,
      sharedFolders: currentUserData?.sharedFolders,
      selectedFolder: folderName || "",
      selectedFolderData,
    });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export { getDashboardView };
