"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// create token
const createToken = (payload, secret, expires, timeStamp) => {
    return jsonwebtoken_1.default.sign({ id: payload === null || payload === void 0 ? void 0 : payload.id, role: payload === null || payload === void 0 ? void 0 : payload.role, at: timeStamp }, secret, {
        expiresIn: expires ? expires : "9999d",
    });
};
// delete token
const deleteToken = (token, secret) => {
    return jsonwebtoken_1.default.sign({ id: token }, secret, {
        expiresIn: "0s",
    });
};
// verify token
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.jwtHelpers = {
    createToken,
    deleteToken,
    verifyToken,
};
//# sourceMappingURL=jwtTokenHelper.js.map