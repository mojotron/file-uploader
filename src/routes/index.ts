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
// auth middlewares
import authMiddleware from "../middlewares/authMiddleware.js";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticatedMiddleware.js";
import redirectToDashboardMiddleware from "../middlewares/redirectToDashboardMiddleware.js";
// routers
import dashboardRouter from "./dashboardRoutes.js";

const router = Router();

router.get("/", redirectToDashboardMiddleware, getIndexView);
router.get("/signup", redirectToDashboardMiddleware, getSignupView);
router.get("/login", redirectToDashboardMiddleware, getLoginView);
// AUTH
router.post("/signup", signupValidator, signupValidationMiddleware, postSignup);
router.post(
  "/login",
  loginValidator,
  loginValidationMiddleware,
  authMiddleware
);
router.get("/logout", postLogout);
// DASHBOARD
router.use("/dashboard", isAuthenticatedMiddleware, dashboardRouter);

export default router;
