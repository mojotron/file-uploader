import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log("HELLO");

  res.render("pages/dashboard");
});

export default router;
