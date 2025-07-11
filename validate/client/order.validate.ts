import { NextFunction, Request, Response } from "express";

export const index = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  if (!req.body.infoUser.fullName) {
    res.json({
      code: 400,
      message: "Please enter your full name!"
    })
  }
  if (!req.body.infoUser.phone || req.body.infoUser.phone.length != 10) {
    res.json({
      code: 400,
      message: "Please enter your phone!"
    })
  }

  next();
}