import { Router } from "express";
import { getDashboardView } from "../controllers/dashboardController.js";
// folder
import {
  createFolderGet,
  createFolderPost,
  editFolderGet,
  editFolderPost,
  deleteFolderGet,
  deleteFolderPost,
} from "../controllers/folderController.js";
// files controller
import {
  uploadFileGet,
  uploadFilePost,
  deleteFileGet,
  deleteFilePost,
  downloadFile,
} from "../controllers/fileController.js";
// shared folder controllers
import {
  sharedFolderView,
  sharedFolderToggleSharedGet,
  sharedFolderToggleSharedPost,
  sharedFolderAddCollaborator,
} from "../controllers/sharedFolderController.js";
// validators
import folderValidator from "../config/validators/folderValidator.js";
import collaboratorValidator from "../config/validators/collaboratorValidator.js";
// validation middleware
import {
  folderValidationMiddleware,
  collaboratorValidationMiddleware,
} from "../middlewares/validationMiddlewares.js";
//
import upload from "../config/multer/multerConfig.js";

const router = Router();

router.get("/", getDashboardView);

// folders
router.get("/create-folder", createFolderGet);
router.post(
  "/create-folder",
  folderValidator,
  folderValidationMiddleware,
  createFolderPost
);
router.get("/:folderName", getDashboardView);
router.get("/:folderName/edit", editFolderGet);
router.post(
  "/:folderName/edit",
  folderValidator,
  folderValidationMiddleware,
  editFolderPost
);
router.get("/:folderName/delete", deleteFolderGet);
router.post("/:folderName/delete", deleteFolderPost);

// shared folder
router.get("/:folderName/shared-options", sharedFolderView);
router.post(
  "/:folderName/shared-options",
  collaboratorValidator,
  collaboratorValidationMiddleware,
  sharedFolderAddCollaborator
);
router.get(
  "/:folderName/shared-options/toggle-shared",
  sharedFolderToggleSharedGet
);
router.post(
  "/:folderName/shared-options/toggle-shared",
  sharedFolderToggleSharedPost
);

// upload file
router.get("/:folderName/upload-file", uploadFileGet);
router.post("/:folderName/upload-file", upload.single("file"), uploadFilePost);
// delete file
router.get("/:folderName/:fileId/delete", deleteFileGet);
router.post("/:folderName/:fileId/delete", deleteFilePost);
// download file
router.get("/:folderName/:fileId/download", downloadFile);

export default router;
