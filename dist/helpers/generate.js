"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTourCode = exports.generateOrderCode = void 0;
const generateOrderCode = (number) => {
    return `OD${String(number).padStart(8, "0")}`;
};
exports.generateOrderCode = generateOrderCode;
const generateTourCode = (number) => {
    return `TOUR${String(number).padStart(6, "0")}`;
};
exports.generateTourCode = generateTourCode;
