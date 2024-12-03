import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const uploadFileGet = (req: Request, res: Response, next: NextFunction) => {
  const { folderName } = req.params;

  return res.status(StatusCodes.OK).render("pages/dashboard-file-form", {
    currentFolder: folderName,
    actionPath: `/dashboard/${folderName}/upload-file`,
  });
};

const uploadFilePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("STEP INTo");

    const { folderName } = req.params;
    const {} = req.body;
    const file = req.file;

    console.log(file);

    return res.status(StatusCodes.OK).redirect(`/dashboard/${folderName}`);
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export { uploadFileGet, uploadFilePost };
