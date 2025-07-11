import express, { Router } from "express";
const router: Router = express.Router();

import * as controller from "../../controllers/client/cart.controller";

router.get("/", controller.index);

router.post("/list-json", controller.listJson);

export default router;