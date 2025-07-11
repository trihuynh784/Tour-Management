import { Request, Response } from "express";
import Category from "../../models/category.model";

// [GET] /categories
export const index = async (req: Request, res: Response) => {
  const categories = await Category.findAll({
    where: {
      deleted: false,
    },
    raw: true,
  });

  res.render("admin/pages/category/index", {
    titlePage: "Danh mục tour",
    categories: categories,
  });
};
