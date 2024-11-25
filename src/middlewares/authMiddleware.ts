import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import passport from "passport";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = matchedData(req);

  console.log("OK");

  passport.authenticate("local", (err: Error, user: any, info: any) => {
    if (err) return next(err);

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).render("pages/login-form", {
        actionPath: "/login",
        inputValues: {
          email,
          password,
        },
        validationErrors: ["invalid email or password"],
      });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.status(StatusCodes.OK).redirect("/");
    });
  })(req, res, next);
};

export default authMiddleware;
