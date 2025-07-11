"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const index = (req, res, next) => {
    console.log(req.body);
    if (!req.body.infoUser.fullName) {
        res.json({
            code: 400,
            message: "Please enter your full name!"
        });
    }
    if (!req.body.infoUser.phone || req.body.infoUser.phone.length != 10) {
        res.json({
            code: 400,
            message: "Please enter your phone!"
        });
    }
    next();
};
exports.index = index;
