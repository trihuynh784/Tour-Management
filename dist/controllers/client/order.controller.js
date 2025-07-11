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
exports.success = exports.index = void 0;
const order_model_1 = __importDefault(require("../../models/order.model"));
const generate_1 = require("../../helpers/generate");
const tour_model_1 = __importDefault(require("../../models/tour.model"));
const order_item_model_1 = __importDefault(require("../../models/order-item.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataOrder = {
            code: "",
            fullName: req.body.infoUser.fullName,
            phone: req.body.infoUser.phone,
            note: req.body.infoUser.note,
            status: "initial",
        };
        const order = yield order_model_1.default.create(dataOrder);
        const orderId = order.dataValues.id;
        const code = (0, generate_1.generateOrderCode)(orderId);
        yield order_model_1.default.update({
            code: code,
        }, {
            where: {
                id: orderId,
            },
        });
        for (const item of req.body.cart) {
            let dataOrderItem = {
                orderId: orderId,
                tourId: item.tourId,
                quantity: item.quantity,
            };
            const tour = yield tour_model_1.default.findOne({
                where: {
                    id: item.tourId,
                    deleted: false,
                    status: "active",
                },
                raw: true,
            });
            dataOrderItem["price"] = tour["price"];
            dataOrderItem["discount"] = tour["discount"];
            dataOrderItem["timeStart"] = tour["timeStart"];
            yield order_item_model_1.default.create(dataOrderItem);
        }
        res.json({
            code: 200,
            message: "Đặt hàng thành công!",
            orderCode: code,
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: 400,
            message: "Lỗi!!!",
        });
    }
});
exports.index = index;
const success = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderCode = req.query.orderCode;
    const order = yield order_model_1.default.findOne({
        where: {
            code: orderCode,
            deleted: false,
            status: "initial",
        },
        raw: true,
    });
    const orderItems = yield order_item_model_1.default.findAll({
        where: {
            orderId: order["id"],
        },
        raw: true,
    });
    for (const item of orderItems) {
        const tour = yield tour_model_1.default.findOne({
            where: {
                id: item["tourId"],
                deleted: false,
            },
            raw: true,
        });
        tour["image"] = JSON.parse(tour["images"])[0];
        item["price_special"] = (item["price"] * (100 - item["discount"])) / 100;
        item["total"] = item["price_special"] * item["quantity"];
        item["infoTour"] = tour;
    }
    order["total_price"] = orderItems.reduce((total, item) => total + item["total"], 0);
    res.render("client/pages/order/success", {
        titlePage: `Đơn đặt hàng - ${orderCode}`,
        order: order,
        orderItems: orderItems,
    });
});
exports.success = success;
