import { Request, Response } from "express";
import Order from "../../models/order.model";
import { generateOrderCode } from "../../helpers/generate";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";

// [POST] /order
export const index = async (req: Request, res: Response) => {
  try {
    const dataOrder = {
      code: "",
      fullName: req.body.infoUser.fullName,
      phone: req.body.infoUser.phone,
      note: req.body.infoUser.note,
      status: "initial",
    };

    // Save data into orders model
    const order = await Order.create(dataOrder);
    const orderId = order.dataValues.id;
    const code = generateOrderCode(orderId);
    await Order.update(
      {
        code: code,
      },
      {
        where: {
          id: orderId,
        },
      }
    );

    // Save data into orders_item model
    for (const item of req.body.cart) {
      let dataOrderItem = {
        orderId: orderId,
        tourId: item.tourId,
        quantity: item.quantity,
      };

      const tour = await Tour.findOne({
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

      await OrderItem.create(dataOrderItem);
    }

    res.json({
      code: 200,
      message: "Đặt hàng thành công!",
      orderCode: code,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Lỗi!!!",
    });
  }
};

// [GET] /order/success
export const success = async (req: Request, res: Response) => {
  const orderCode = req.query.orderCode;

  const order = await Order.findOne({
    where: {
      code: orderCode,
      deleted: false,
      status: "initial",
    },
    raw: true,
  });

  const orderItems = await OrderItem.findAll({
    where: {
      orderId: order["id"],
    },
    raw: true,
  });

  for (const item of orderItems) {
    const tour = await Tour.findOne({
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

  order["total_price"] = orderItems.reduce(
    (total, item) => total + item["total"],
    0
  );

  res.render("client/pages/order/success", {
    titlePage: `Đơn đặt hàng - ${orderCode}`,
    order: order,
    orderItems: orderItems,
  });
};
