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
exports.checkInviteToken = exports.checkToken = void 0;
const variables_1 = __importDefault(require("../config/variables"));
const jwtTokenHelper_1 = require("../lib/jwtTokenHelper");
const sendResponse_1 = require("../lib/sendResponse");
// check token
const checkToken = (req, res, next) => {
    const { authorization_token } = req.headers;
    try {
        const token = authorization_token.split(" ")[1];
        if (token === variables_1.default.bearer_token) {
            next();
        }
    }
    catch (error) {
        next("authorization failed");
    }
};
exports.checkToken = checkToken;
// check invite token
const checkInviteToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("Authorization");
    if (!token) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        jwtTokenHelper_1.jwtHelpers.verifyToken(token, variables_1.default.jwt_secret);
        next();
    }
    catch (error) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 401,
            success: false,
            message: "Invalid token",
        });
    }
});
exports.checkInviteToken = checkInviteToken;
//# sourceMappingURL=checkToken.js.map