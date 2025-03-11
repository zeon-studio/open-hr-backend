"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// create token
const createToken = (payload, secret, expires = "7d", timeStamp) => {
    return jsonwebtoken_1.default.sign({ id: payload.id, role: payload.role, at: timeStamp }, secret, {
        expiresIn: expires,
    });
};
// verify token
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.jwtHelpers = {
    createToken,
    verifyToken,
};
//# sourceMappingURL=jwtTokenHelper.js.map