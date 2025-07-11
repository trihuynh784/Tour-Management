import { Express } from "express";
import systemConfig from "../../config/system";
import categoryRoutes from "./category.route";
import tourRoutes from "./tour.route";
import uploadRoutes from "./upload.route";

const pathAdmin = systemConfig.prefixAdmin;

const adminRoute = (app: Express) => {
  app.use(pathAdmin + "/categories", categoryRoutes);

  app.use(pathAdmin + "/tours", tourRoutes);

  app.use(pathAdmin + "/upload", uploadRoutes);
};

export default adminRoute;
