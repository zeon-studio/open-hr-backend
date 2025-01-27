"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveAllottedDays = exports.conditionalWeekendDays = exports.weekendDays = exports.paginationField = void 0;
exports.paginationField = ["limit", "page", "sortBy", "sortOrder"];
exports.weekendDays = ["Friday"];
exports.conditionalWeekendDays = {
    Saturday: [1, 3], // Array of week numbers
};
exports.leaveAllottedDays = {
    casual: 10,
    sick: 5,
    earned: 12,
    without_pay: 30,
};
//# sourceMappingURL=constants.js.map