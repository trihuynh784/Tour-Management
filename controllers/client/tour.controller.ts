import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /categories/:slugCategory
export const index = async (req: Request, res: Response) => {
  const slugCategory = req.params.slugCategory;

  const category = await Category.findOne({
    where: {
      deleted: false,
      status: "active",
      slug: slugCategory,
    },
  });

  const tours = await sequelize.query(
    `
      SELECT tours.*, price * (1 - discount/100) AS price_special
      FROM tours
      JOIN tours_categories ON tours.id = tours_categories.tourId
      JOIN categories ON tours_categories.categoryId = categories.id
      WHERE categories.slug = '${slugCategory}'
        AND categories.deleted = false
        AND categories.status = 'active'
        AND tours.deleted = false
        AND categories.status = 'active'
  `,
    {
      type: QueryTypes.SELECT,
    }
  );

  tours.forEach((tour) => {
    if (tour["images"]) {
      const images = JSON.parse(tour["images"]);
      tour["image"] = images[0];
    }

    tour["price_special"] = parseFloat(tour["price_special"]);
  });

  res.render("client/pages/tour/index", {
    titlePage: category["title"],
    tours: tours,
  });
};

// [GET] /categories/detail
export const detail = async (req: Request, res: Response) => {
  const slugTour = req.params.slugTour;

  const tour = await Tour.findOne({
    where: {
      slug: slugTour,
      deleted: false,
      status: "active",
    },
    raw: true,
  });
  if (tour["images"]) {
    tour["images"] = JSON.parse(tour["images"]);
  }
  tour["price_special"] = (tour["price"] * (100 - tour["discount"])) / 100;

  res.render("client/pages/tour/detail", {
    titlePage: tour["title"],
    tour: tour,
  });
};
