import { Router } from "express";
// controllers
import {
  getIndexView,
  getSignupView,
  getLoginView,
} from "../controllers/viewController.js";

const router = Router();

router.get("/", getIndexView);
router.get("/signup", getSignupView);
router.get("/login", getLoginView);

export default router;
