import { Request, Response } from "express";
import Tour from "../../models/tour.model";

// [GET] /cart
export const index = async (req: Request, res: Response) => {
  res.render("client/pages/cart/index", {
    titlePage: "Giỏ hàng",
  });
};

// [GET] /cart/list-json
export const listJson = async (req: Request, res: Response) => {
  const tours = req.body;
  for (const tour of tours) {
    const infoTour = await Tour.findOne({
      where: {
        id: tour.tourId,
        deleted: false,
        status: "active",
      },
      raw: true,
    });
    infoTour["image"] = JSON.parse(infoTour["images"])[0];
    tour["price_special"] = (infoTour["price"] * (100 - infoTour["discount"])) / 100;
    tour["total_price"] = tour.quantity * tour["price_special"];
    tour["info"] = infoTour;
  }

  res.json({
    tours: tours,
  });
};
