import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import supabase from "../config/supabase/supabaseConfig.js";

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

    if (file) {
      const { data, error } = await supabase.storage
        .from("file")
        .upload("new-file", file.buffer, {
          cacheControl: "3600",
          upsert: false,
        });
      console.log(data, error);
    }

    console.log(file);

    return res.status(StatusCodes.OK).redirect(`/dashboard/${folderName}`);
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export { uploadFileGet, uploadFilePost };
