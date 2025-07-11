import express, { Router } from "express";
import multer from "multer";
const router: Router = express.Router();
const upload = multer();

import * as controller from "../../controllers/admin/tour.controller";
import { uploadFields } from "../../middleware/admin/uploadCloud.middleware";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.fields([{ name: "images", maxCount: 10 }]),
  uploadFields,
  controller.createPost
);

export default router;
