import express, { Router } from "express";
const router: Router = express.Router();

import * as controller from "../../controllers/client/tour.controller";

router.get("/:slugCategory", controller.index);

router.get("/detail/:slugTour", controller.detail);

export default router;
