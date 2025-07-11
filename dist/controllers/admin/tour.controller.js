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
exports.createPost = exports.create = exports.index = void 0;
const tour_model_1 = __importDefault(require("../../models/tour.model"));
const generate_1 = require("../../helpers/generate");
const category_model_1 = __importDefault(require("../../models/category.model"));
const tour_category_model_1 = __importDefault(require("../../models/tour-category.model"));
const system_1 = __importDefault(require("../../config/system"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tours = yield tour_model_1.default.findAll({
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
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.default.findAll({
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
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countTour = yield tour_model_1.default.count();
        const tourCode = (0, generate_1.generateTourCode)(countTour + 1);
        console.log(req.body);
        if (req.body.position === "") {
            req.body.position = countTour + 1;
        }
        else {
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
        const tour = yield tour_model_1.default.create(dataTour);
        const tourId = tour["id"];
        const dataTourCategory = {
            tourId: tourId,
            categoryId: parseInt(req.body.category),
        };
        yield tour_category_model_1.default.create(dataTourCategory);
        res.redirect(`${system_1.default.prefixAdmin}/tours`);
    }
    catch (error) {
        console.log(error);
        res.send("Error!");
    }
});
exports.createPost = createPost;
