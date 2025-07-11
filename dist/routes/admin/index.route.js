"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = __importDefault(require("../../config/system"));
const category_route_1 = __importDefault(require("./category.route"));
const tour_route_1 = __importDefault(require("./tour.route"));
const upload_route_1 = __importDefault(require("./upload.route"));
const pathAdmin = system_1.default.prefixAdmin;
const adminRoute = (app) => {
    app.use(pathAdmin + "/categories", category_route_1.default);
    app.use(pathAdmin + "/tours", tour_route_1.default);
    app.use(pathAdmin + "/upload", upload_route_1.default);
};
exports.default = adminRoute;
