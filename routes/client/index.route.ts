import { Express } from "express";
import tourRoutes from "./tour.route";
import categoryRoutes from "./category.route";
import cartRoutes from "./cart.route";
import orderRoutes from "./order.route";

const clientRoute = (app: Express) => {
  app.use("/tours", tourRoutes);

  app.use("/categories", categoryRoutes);

  app.use("/cart", cartRoutes);

  app.use("/order", orderRoutes);
};

export default clientRoute;
