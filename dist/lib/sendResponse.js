"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, response) => {
    res.status(response.statusCode || 200).json({
        success: response.success,
        message: response.message,
        result: response.result,
        meta: response.meta,
    });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map