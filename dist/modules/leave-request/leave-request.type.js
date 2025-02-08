"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELeaveRequestType = exports.ELeaveRequestStatus = void 0;
var ELeaveRequestStatus;
(function (ELeaveRequestStatus) {
    ELeaveRequestStatus["PENDING"] = "pending";
    ELeaveRequestStatus["APPROVED"] = "approved";
    ELeaveRequestStatus["REJECTED"] = "rejected";
})(ELeaveRequestStatus || (exports.ELeaveRequestStatus = ELeaveRequestStatus = {}));
var ELeaveRequestType;
(function (ELeaveRequestType) {
    ELeaveRequestType["CASUAL"] = "casual";
    ELeaveRequestType["SICK"] = "sick";
    ELeaveRequestType["EARNED"] = "earned";
    ELeaveRequestType["WITHOUT_PAY"] = "without_pay";
})(ELeaveRequestType || (exports.ELeaveRequestType = ELeaveRequestType = {}));
//# sourceMappingURL=leave-request.type.js.map