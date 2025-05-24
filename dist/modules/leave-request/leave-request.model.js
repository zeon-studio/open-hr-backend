"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequest = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const leave_request_type_1 = require("./leave-request.type");
const leaveSchema = new mongoose_1.default.Schema({
    employee_id: {
        type: String,
        required: true,
    },
    leave_type: {
        type: String,
        required: true,
        enum: leave_request_type_1.ELeaveRequestType,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    day_count: {
        type: Number,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: leave_request_type_1.ELeaveRequestStatus,
        default: leave_request_type_1.ELeaveRequestStatus.PENDING,
    },
    response_date: {
        type: Date,
    },
}, {
    timestamps: true,
});
// index for faster search
leaveSchema.index({ employee_id: 1 });
leaveSchema.index({ end_date: 1 });
exports.LeaveRequest = (0, mongoose_1.model)("leave_request", leaveSchema);
//# sourceMappingURL=leave-request.model.js.map