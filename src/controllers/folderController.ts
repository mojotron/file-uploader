import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";

const createFolderGet = (req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.OK).render("pages/dashboard-folder-form", {
    actionPath: "/dashboard/folder/create",
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
  } catch (error) {
    return next(error);
  }
};

export { createFolderGet, createFolderPost };
