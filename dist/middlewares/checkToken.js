"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const variables_1 = __importDefault(require("../config/variables"));
const checkToken = (req, res, next) => {
    const { authorization_token } = req.headers;
    try {
        if (authorization_token &&
            authorization_token.split(" ")[1] === variables_1.default.bearer_token) {
            next();
        }
        else {
            throw new Error("Invalid token");
        }
    }
    catch (error) {
        next(error);
    }
};
exports.checkToken = checkToken;
//# sourceMappingURL=checkToken.js.map