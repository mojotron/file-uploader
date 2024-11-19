import "dotenv/config";
import url from "node:url";
import path from "node:path";
import express from "express";
//
import routes from "./routes/index.js";

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
// routes
app.use(routes);

app.listen(port, () => console.log(`server running on port ${port}`));
