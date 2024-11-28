import { Router } from "express";
// folder
import { createFolderGet } from "../controllers/folderController.js";
// validators
import folderValidator from "../config/validators/folderValidator.js";
// validation middleware
import { createFolderValidationMiddleware } from "../middlewares/validationMiddlewares.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("pages/dashboard");
});

router.get(
  "/folder/create",
  folderValidator,
  createFolderValidationMiddleware,
  createFolderGet
);

export default router;
