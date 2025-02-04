"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelpers = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page);
    const limit = Number(options.limit);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.paginationHelpers = {
    calculatePagination,
};
//# sourceMappingURL=paginationHelper.js.map