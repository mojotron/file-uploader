import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// errors
import { BadRequestError } from "../errors/index.js";
// config files
import prisma from "../config/prisma/prismaConfig.js";
import supabase from "../config/supabase/supabaseConfig.js";
// constants
import { BUCKET_NAME } from "../constants/supabaseConstants.js";

const uploadFileGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;

    const folderData = await prisma.folder.findUnique({
      where: { id: folderId },
      select: { name: true },
    });

    return res.status(StatusCodes.OK).render("pages/dashboard-file-form", {
      currentFolder: folderData?.name,
      actionPath: `/dashboard/${folderId}/upload-file`,
      validationErrors: [],
    });
  } catch (error) {
    return next(error);
  }
};

const uploadFilePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const file = req.file;

    if (file === undefined) {
      throw new BadRequestError(`No file selected!`);
    }

    const folderData = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (folderData === null) throw new BadRequestError(`No folder found!`);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`${folderData.id}/${file.originalname}`, file.buffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new BadRequestError(`error uploading file to file storage`);
    }

    await prisma.file.create({
      data: {
        name: file.originalname,
        folderId: folderData.id,
      },
    });

    return res.status(StatusCodes.OK).redirect(`/dashboard/${folderData.id}`);
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
    const { folderId, fileId } = req.params;

    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: { name: true },
    });

    return res.status(StatusCodes.OK).render("pages/dashboard-confirm-box", {
      actionPath: `/dashboard/${folderId}/${fileId}/delete`,
      cancelPath: `/dashboard/${folderId}`,
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
    const { folderId, fileId } = req.params;

    const fileData = await prisma.file.findUnique({
      where: { id: fileId },
      include: { folder: true },
    });

    if (fileData === null) throw new BadRequestError("no file found to delete");

    const { data, error: bucketError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([`${fileData.folder.id}/${fileData.name}`]);
    if (bucketError) throw new BadRequestError("error deleting file in bucket");

    await prisma.file.delete({ where: { id: fileData.id } });

    return res.status(StatusCodes.OK).redirect(`/dashboard/${folderId}`);
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
    const { folderId, fileId } = req.params;

    const fileData = await prisma.file.findUnique({
      where: { id: fileId },
      include: { folder: true },
    });
    if (fileData === null) throw new BadRequestError("no file to dw");

    const { data: signedData, error: dataError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(`${fileData.folder.id}/${fileData.name}`, 60, {
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
