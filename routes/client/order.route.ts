import express, { Router } from "express";
const router: Router = express.Router();

import * as controller from "../../controllers/client/order.controller";
import * as validate from "../../validate/client/order.validate";

router.post("/", validate.index, controller.index);

router.get("/success", controller.success);

export default router;