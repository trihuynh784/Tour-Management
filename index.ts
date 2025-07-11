import express, { Express } from "express";
import dotenv from "dotenv";
import moment from "moment";
import bodyParser from "body-parser";
import path from "path";
import sequelize from "./config/database";
import clientRoute from "./routes/client/index.route";
import adminRoute from "./routes/admin/index.route";
import systemConfig from "./config/system";

dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// Connect database
sequelize;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Set static folder public
app.use(express.static(`${__dirname}/public`));

// Set locals for PUG
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// TinyMce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Routes
clientRoute(app);
adminRoute(app);

app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
