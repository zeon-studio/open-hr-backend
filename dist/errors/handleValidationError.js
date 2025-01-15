"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = void 0;
const handleValidationErrors = (error) => {
    const errors = Object.keys(error.errors).map((el) => {
        return {
            path: error.errors[el].path,
            message: error.errors[el].message,
        };
    });
    const statusCode = 500;
    return {
        message: "Validation Error",
        errorMessage: errors,
        statusCode: statusCode,
    };
};
exports.handleValidationErrors = handleValidationErrors;
//# sourceMappingURL=handleValidationError.js.map