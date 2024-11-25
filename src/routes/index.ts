import { Router } from "express";
// controllers
import {
  getIndexView,
  getSignupView,
  getLoginView,
} from "../controllers/viewController.js";
import { postSignup, postLogout } from "../controllers/authController.js";
// input validators
import signupValidator from "../config/validators/signupValidator.js";
import loginValidator from "../config/validators/loginValidator.js";
// validation middlewares
import {
  signupValidationMiddleware,
  loginValidationMiddleware,
} from "../middlewares/validationMiddlewares.js";
// auth middleware
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getIndexView);
router.get("/signup", getSignupView);
router.get("/login", getLoginView);
// AUTH
router.post("/signup", signupValidator, signupValidationMiddleware, postSignup);
router.post(
  "/login",
  loginValidator,
  loginValidationMiddleware,
  authMiddleware
);
router.get("/logout", postLogout);

export default router;
