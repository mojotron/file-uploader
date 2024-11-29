import { Router } from "express";
import { getDashboardView } from "../controllers/dashboardController.js";
// folder
import {
  createFolderGet,
  createFolderPost,
  getFolder,
} from "../controllers/folderController.js";
// validators
import folderValidator from "../config/validators/folderValidator.js";
// validation middleware
import { createFolderValidationMiddleware } from "../middlewares/validationMiddlewares.js";

const router = Router();

router.get("/", getDashboardView);

// folders
router.get("/create-folder", createFolderGet);
router.post(
  "/create-folder",
  folderValidator,
  createFolderValidationMiddleware,
  createFolderPost
);
router.get("/:folderName", getDashboardView);

export default router;
