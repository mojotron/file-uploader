import { Router } from "express";
// controllers
import {
  getIndexView,
  getSignupView,
  getLoginView,
} from "../controllers/viewController.js";
import { postSignup, postLogin } from "../controllers/authController.js";
// input validators
import signupValidator from "../config/validators/signupValidator.js";
import loginValidator from "../config/validators/loginValidator.js";
// validation middlewares
import {
  signupValidationMiddleware,
  loginValidationMiddleware,
} from "../middlewares/validationMiddlewares.js";

const router = Router();

router.get("/", getIndexView);
router.get("/signup", getSignupView);
router.get("/login", getLoginView);
// AUTH
router.post("/signup", signupValidator, signupValidationMiddleware, postSignup);
router.post("/login", loginValidator, loginValidationMiddleware, postLogin);

export default router;
