import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma/prismaConfig.js";
// constants
import {
  FOLDER_LIMIT_COUNT,
  FILE_LIMIT_COUNT,
} from "../constants/storageLimit.js";

const folderLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user as { userId: string };

    const foldersData = await prisma.user.findUnique({
      where: { id: userId },
      select: { _count: { select: { folders: true } } },
    });

    if (foldersData && foldersData._count.folders >= FOLDER_LIMIT_COUNT) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .render("pages/dashboard-error", {
          heading: `To Many Folders`,
          subheading: `limit reached...`,
          message: `This is tiny learning project with limited storage space. Maximum number of folders is limited to ${FOLDER_LIMIT_COUNT}. `,
        });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const fileLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;

    const filesData = await prisma.folder.findUnique({
      where: { id: folderId },
      select: { _count: { select: { files: true } } },
    });

    if (filesData && filesData._count.files >= FILE_LIMIT_COUNT) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .render("pages/dashboard-error", {
          heading: `To Many Files`,
          subheading: `limit reached...`,
          message: `This is tiny learning project with limited storage space. Maximum number of files per folder is limited to ${FILE_LIMIT_COUNT}. `,
        });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export { folderLimitMiddleware, fileLimitMiddleware };
