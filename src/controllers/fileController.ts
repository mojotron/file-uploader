import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// errors
import { BadRequestError } from "../errors/index.js";
// config files
import prisma from "../config/prisma/prismaConfig.js";
import supabase from "../config/supabase/supabaseConfig.js";
// constants
import { BUCKET_NAME } from "../constants/supabaseConstants.js";

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
    const { username } = req.user as { userId: string; username: string };
    const { folderName } = req.params;
    const file = req.file;

    if (file === undefined) {
      throw new BadRequestError(`No file selected!`);
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`${folderName}-${username}/${file.originalname}`, file.buffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new BadRequestError(`error uploading file to file storage`);
    }

    const folder = await prisma.folder.findFirst({
      where: { name: folderName },
    });

    if (folder === null) throw new BadRequestError("no folder");

    await prisma.file.create({
      data: {
        name: file.originalname,
        folderId: folder.id,
      },
    });

    return res.status(StatusCodes.OK).redirect(`/dashboard/${folderName}`);
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

const deleteFileGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderName, fileId } = req.params;

    const file = await prisma.file.findUnique({ where: { id: fileId } });

    return res.status(StatusCodes.OK).render("pages/dashboard-confirm-box", {
      actionPath: `/dashboard/${folderName}/${fileId}/delete`,
      cancelPath: `/dashboard/${folderName}`,
      heading: `Delete file "${file?.name}"`,
      message: `You are about to delete this file. This action is permanent. Do you want to proceed?`,
      cancelText: `Cancel`,
      acceptText: `Delete`,
      danger: true,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteFilePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.user as { userId: string; username: string };
    const { folderName, fileId } = req.params;

    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (file === null) throw new BadRequestError("no file found to delete");

    const { data, error: bucketError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([`${folderName}-${username}/${file.name}`]);
    if (bucketError) throw new BadRequestError("error deleting file in bucket");

    await prisma.file.delete({ where: { id: file.id } });

    return res.status(StatusCodes.OK).redirect(`/dashboard/${folderName}`);
  } catch (error) {
    return next(error);
  }
};

const downloadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.user as { userId: string; username: string };
    const { folderName, fileId } = req.params;

    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (file === null) throw new BadRequestError("no file to dw");

    const { data: signedData, error: dataError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(`${folderName}-${username}/${file.name}`, 60, {
        download: true,
      });
    if (dataError) throw new BadRequestError("error signing data");

    return res.status(StatusCodes.OK).redirect(signedData.signedUrl);
  } catch (error) {
    return next(error);
  }
};

export {
  uploadFileGet,
  uploadFilePost,
  deleteFileGet,
  deleteFilePost,
  downloadFile,
};
