import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = matchedData(req);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return res.status(StatusCodes.CREATED).redirect("/login");
  } catch (error) {
    return next(error);
  }
};

const postLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.logout((logoutErr) => {
      if (logoutErr) return next(logoutErr);
    });

    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
};

export { postSignup, postLogout };
