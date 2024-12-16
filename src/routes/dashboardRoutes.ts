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
  sharedFolderRemoveCollaboratorGet,
  sharedFolderRemoveCollaboratorPost,
  sharedFolderExitGet,
  sharedFolderExitPost,
} from "../controllers/sharedFolderController.js";
// validators
import folderValidator from "../config/validators/folderValidator.js";
import collaboratorValidator from "../config/validators/collaboratorValidator.js";
import fileValidator from "../config/validators/fileValidator.js";
// validation middleware
import {
  folderValidationMiddleware,
  collaboratorValidationMiddleware,
  fileValidationMiddleware,
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
router.get("/:folderId", getDashboardView);
router.get("/:folderId/edit", editFolderGet);
router.post(
  "/:folderId/edit",
  folderValidator,
  folderValidationMiddleware,
  editFolderPost
);
router.get("/:folderId/delete", deleteFolderGet);
router.post("/:folderId/delete", deleteFolderPost);

// shared folder
router.get("/:folderId/shared-options", sharedFolderView);
router.post(
  "/:folderId/shared-options",
  collaboratorValidator,
  collaboratorValidationMiddleware,
  sharedFolderAddCollaborator
);
router.get(
  "/:folderId/shared-options/toggle-shared",
  sharedFolderToggleSharedGet
);
router.post(
  "/:folderId/shared-options/toggle-shared",
  sharedFolderToggleSharedPost
);
router.get(
  "/:folderId/shared-options/remove-user/:userId",
  sharedFolderRemoveCollaboratorGet
);
router.post(
  "/:folderId/shared-options/remove-user/:userId",
  sharedFolderRemoveCollaboratorPost
);
router.get("/:folderId/exit-shared-folder", sharedFolderExitGet);
router.post("/:folderId/exit-shared-folder", sharedFolderExitPost);

// upload file
router.get("/:folderId/upload-file", uploadFileGet);
router.post(
  "/:folderId/upload-file",
  upload.single("file"),
  fileValidator,
  fileValidationMiddleware,
  uploadFilePost
);
// delete file
router.get("/:folderId/:fileId/delete", deleteFileGet);
router.post("/:folderId/:fileId/delete", deleteFilePost);
// download file
router.get("/:folderId/:fileId/download", downloadFile);

export default router;
