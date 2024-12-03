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
} from "../controllers/fileController.js";
// validators
import folderValidator from "../config/validators/folderValidator.js";
// validation middleware
import { folderValidationMiddleware } from "../middlewares/validationMiddlewares.js";
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

// files
router.get("/:folderName/upload-file", uploadFileGet);
router.post("/:folderName/upload-file", upload.single("file"), uploadFilePost);

export default router;
