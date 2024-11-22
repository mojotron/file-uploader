import { Router } from "express";
// controllers
import {
  getIndexView,
  getSignupView,
  getLoginView,
} from "../controllers/viewController.js";
import { postSignup } from "../controllers/authController.js";
// input validators
import signupValidator from "../config/validators/signupValidator.js";
// validation middlewares
import { signupValidationMiddleware } from "../middlewares/validationMiddlewares.js";

const router = Router();

router.get("/", getIndexView);
router.get("/signup", getSignupView);
router.get("/login", getLoginView);
// AUTH
router.post("/signup", signupValidator, signupValidationMiddleware, postSignup);

export default router;
