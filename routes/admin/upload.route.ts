import express, { Router } from "express";
const router: Router = express.Router();

import multer from "multer";
const upload = multer();

import * as controller from "../../controllers/admin/upload.controller";
import { uploadSingle } from "../../middleware/admin/uploadCloud.middleware";

router.post("/", upload.single("file"), uploadSingle, controller.index);

export default router;
