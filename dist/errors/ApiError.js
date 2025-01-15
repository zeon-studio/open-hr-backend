"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(message, statusCode, stack) {
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map