import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// NOTE! READ FOLDER CRUD OPERATION IS IN DASHBOARD CONTROLLER

const createFolderGet = (req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.OK).render("pages/dashboard-folder-form", {
    actionPath: "/dashboard/create-folder",
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

    console.log(req.user);

    const newFolder = await prisma.folder.create({
      data: {
        createdById: userId,
        name: folderName,
        description: folderDescription,
      },
    });

    console.log(newFolder);

    // TODO REDIRECT TO NEW FOLDER
    return res.status(StatusCodes.CREATED).redirect("/dashboard");
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

const getFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { folderName } = req.params;
    const { userId } = req.user as { userId: string };
    console.log("HO HO");

    return res.status(StatusCodes.OK).render("pages/dashboard-folder");
  } catch (error) {
    return next(error);
  }
};

export { createFolderGet, createFolderPost, getFolder };
