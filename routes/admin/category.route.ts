import express, { Router } from "express";
const router: Router = express.Router();

import * as controller from "../../controllers/admin/category.controller"

router.get("/", controller.index)

export default router;