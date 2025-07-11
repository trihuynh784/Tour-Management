import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

let streamUpload = (
  buffer: Buffer,
  resourceType: "image" | "video" | "raw" = "image"
) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadToCloudinary = async (
  buffer: Buffer,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<any> => {
  let result = await streamUpload(buffer, resourceType);
  return result["url"];
};

export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body[req.file.fieldname] = await uploadToCloudinary(req.file.buffer);
  } catch (error) {
    console.log(error);
  }

  next();
};

export const uploadFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  for (const key in req["files"]) {
    req.body[key] = [];

    const array = req["files"][key];
    for (const item of array) {
      try {
        const resourceType = item.mimetype.startsWith("audio/")
          ? "video"
          : item.mimetype.startsWith("image/")
          ? "image"
          : "raw";
        const result = await uploadToCloudinary(item.buffer, resourceType);
        req.body[key].push(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  next();
};
