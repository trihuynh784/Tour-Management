import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import { generateTourCode } from "../../helpers/generate";
import Category from "../../models/category.model";
import TourCategory from "../../models/tour-category.model";
import systemConfig from "../../config/system";

// [GET] /tours
export const index = async (req: Request, res: Response) => {
  const tours = await Tour.findAll({
    where: {
      deleted: false,
    },
    raw: true,
  });

  tours.forEach((tour) => {
    if (tour["images"]) {
      tour["image"] = JSON.parse(tour["images"])[0];
    }
  });

  res.render("admin/pages/tour/index", {
    titlePage: "Danh sách tour",
    tours: tours,
  });
};

// [GET] /tours/create
export const create = async (req: Request, res: Response) => {
  const categories = await Category.findAll({
    where: {
      deleted: false,
      status: "active",
    },
    raw: true,
  });

  res.render("admin/pages/tour/create", {
    titlePage: "Tạo mới Tour",
    categories: categories,
  });
};

// [POST] /tours/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const countTour = await Tour.count();
    const tourCode = generateTourCode(countTour + 1);
    console.log(req.body);

    if (req.body.position === "") {
      req.body.position = countTour + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const dataTour = {
      title: req.body.title,
      code: tourCode,
      images: req.body.images ? JSON.stringify(req.body.images) : "",
      price: parseInt(req.body.price),
      discount: parseInt(req.body.discount),
      stock: parseInt(req.body.stock),
      information: req.body.information,
      schedule: req.body.schedule,
      status: req.body.status,
      timeStart: req.body.timeStart,
      position: req.body.position,
    };

    const tour = await Tour.create(dataTour);
    const tourId = tour["id"];

    const dataTourCategory = {
      tourId: tourId,
      categoryId: parseInt(req.body.category),
    };

    await TourCategory.create(dataTourCategory);

    res.redirect(`${systemConfig.prefixAdmin}/tours`);
  } catch (error) {
    console.log(error);
    res.send("Error!");
  }
};
