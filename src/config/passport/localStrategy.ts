import passport from "passport";
import { Strategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const errorMessage = `invalid email or password`;

const prisma = new PrismaClient();

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const strategy = new Strategy(customFields, async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user === null) {
      throw new Error(errorMessage); // TODO ERROR
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid === false) {
      throw new Error(errorMessage); // TODO ERROR
    }

    return done(null, { userId: user.id });
  } catch (error) {
    return done(error);
  }
});

passport.serializeUser((user, done) => {
  const { userId } = user as { userId: string };
  done(null, userId);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: { id: true, username: true },
    });
    done(null, { userId: user?.id, username: user?.username });
  } catch (error) {
    done(error);
  }
});

export default strategy;
