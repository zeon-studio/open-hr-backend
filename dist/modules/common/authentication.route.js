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
const variables_1 = __importDefault(require("../../config/variables"));
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const jwtTokenHelper_1 = require("../../lib/jwtTokenHelper");
const sendResponse_1 = require("../../lib/sendResponse");
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const employee_model_1 = require("../employee/employee.model");
const authenticationRouter = express_1.default.Router();
const loginService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUser = yield employee_model_1.Employee.findOne({ work_email: user.email });
    if (!loginUser) {
        throw new Error("User not found");
    }
    const userDetails = {
        name: loginUser.name,
        email: loginUser.work_email,
        userId: loginUser.id,
        role: loginUser.role || "user",
        accessToken: "",
    };
    const token = jwtTokenHelper_1.jwtHelpers.createToken({ user_id: loginUser.id, role: loginUser.role }, variables_1.default.jwt_secret, variables_1.default.jwt_expire);
    userDetails.accessToken = token;
    return userDetails;
});
const loginController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    const userDetails = yield loginService(user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: userDetails,
        message: "user logged in successfully",
    });
}));
authenticationRouter.post("/login", checkToken_1.checkToken, loginController);
exports.default = authenticationRouter;
//# sourceMappingURL=authentication.route.js.map