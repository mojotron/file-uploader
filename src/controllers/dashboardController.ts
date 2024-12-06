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
    // get all folders
    const userFolders = await prisma.folder.findMany({
      where: { createdById: userId },
      select: {
        id: true,
        name: true,
      },
    });

    let selectedFolderData: Folder | null = null;

    if (folderName !== undefined) {
      selectedFolderData = await prisma.folder.findFirst({
        where: { name: folderName },
        include: { files: { select: { id: true, name: true } } },
      });
    }

    // const sharedFolders = await prisma.folder.findMany({
    //   where: { sharedTo: {} },
    // });

    return res.status(StatusCodes.OK).render("pages/dashboard", {
      currentUser: userId,
      userFolders,
      selectedFolder: folderName || "",
      selectedFolderData,
    });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export { getDashboardView };
