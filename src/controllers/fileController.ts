import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import supabase from "../config/supabase/supabaseConfig.js";
import { BadRequestError } from "../errors/index.js";
import prisma from "../config/prisma/prismaConfig.js";

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
    const { folderName } = req.params;
    const file = req.file;

    if (file === undefined) {
      throw new BadRequestError(`No file selected!`);
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("files")
      .upload(file.originalname, file.buffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new BadRequestError(`error uploading file to file storage`);
    }

    const { data: dataUrl, error: urlError } = await supabase.storage
      .from("files")
      .createSignedUrl(file.originalname, 3600);

    if (urlError) {
      throw new BadRequestError(`error signing url`);
    }

    const folder = await prisma.folder.findFirst({
      where: { name: folderName },
    });

    if (folder === null) throw new BadRequestError("no folder");

    await prisma.file.create({
      data: {
        name: file.originalname,
        folderId: folder.id,
        signedUrl: dataUrl.signedUrl,
      },
    });

    return res.status(StatusCodes.OK).redirect(`/dashboard/${folderName}`);
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export { uploadFileGet, uploadFilePost };
