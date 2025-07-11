"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.index = void 0;
const tour_model_1 = __importDefault(require("../../models/tour.model"));
const category_model_1 = __importDefault(require("../../models/category.model"));
const database_1 = __importDefault(require("../../config/database"));
const sequelize_1 = require("sequelize");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugCategory = req.params.slugCategory;
    const category = yield category_model_1.default.findOne({
        where: {
            deleted: false,
            status: "active",
            slug: slugCategory,
        },
    });
    const tours = yield database_1.default.query(`
      SELECT tours.*, price * (1 - discount/100) AS price_special
      FROM tours
      JOIN tours_categories ON tours.id = tours_categories.tourId
      JOIN categories ON tours_categories.categoryId = categories.id
      WHERE categories.slug = '${slugCategory}'
        AND categories.deleted = false
        AND categories.status = 'active'
        AND tours.deleted = false
        AND categories.status = 'active'
  `, {
        type: sequelize_1.QueryTypes.SELECT,
    });
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
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugTour = req.params.slugTour;
    const tour = yield tour_model_1.default.findOne({
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
});
exports.detail = detail;
