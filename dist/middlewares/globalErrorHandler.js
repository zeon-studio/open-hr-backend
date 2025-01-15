"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorhandler = void 0;
const variables_1 = __importDefault(require("../config/variables"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const handleValidationError_1 = require("../errors/handleValidationError");
const globalErrorhandler = (error, req, res, next) => {
    let statuscode = 500;
    let message = "something went wrong";
    let errorMessage = [];
    if (error.name === "ValidationError") {
        const simplifiedErrors = (0, handleValidationError_1.handleValidationErrors)(error);
        statuscode = simplifiedErrors.statusCode;
        errorMessage = simplifiedErrors.errorMessage;
        message = simplifiedErrors.message;
    }
    else if (error.message === "jwt expired") {
        statuscode = 401;
        message = error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof ApiError_1.default) {
        statuscode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof Error) {
        message = error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statuscode).json(Object.assign({ success: false, message,
        errorMessage }, (variables_1.default.env === "development" && { stack: error.stack })));
    next();
};
exports.globalErrorhandler = globalErrorhandler;
//# sourceMappingURL=globalErrorHandler.js.map