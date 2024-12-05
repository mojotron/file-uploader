import "dotenv/config";
import url from "node:url";
import path from "node:path";
import express from "express";
import session from "express-session";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
//
import routes from "./routes/index.js";
import localStrategy from "./config/passport/localStrategy.js";
import {
  notFoundMiddleware,
  errorHandlerMiddleware,
} from "./middlewares/errorMiddlewares.js";
import prisma from "./config/prisma/prismaConfig.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT;

const app = express();
// templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// public
app.use(express.static(path.join(__dirname, "public")));
// body parser
app.use(express.urlencoded({ extended: false }));
// sessions
app.use(
  session({
    secret: process.env.COOKIE_SECRET as string,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
// passport
passport.use(localStrategy);
app.use(passport.session());
// routes
app.use(routes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    app.listen(port, () => console.log(`server running on port ${port}`));
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
