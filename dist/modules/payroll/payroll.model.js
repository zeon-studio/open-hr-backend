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
exports.Payroll = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const payroll_type_1 = require("./payroll.type");
const payrollSchema = new mongoose_1.default.Schema({
    employee_id: {
        type: String,
        required: true,
    },
    gross_salary: {
        type: Number,
        required: true,
    },
    salary: [
        {
            amount: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
    bonus: [
        {
            type: {
                type: String,
                required: true,
                enum: payroll_type_1.EBonusType,
            },
            reason: {
                type: String,
            },
            amount: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
    increments: [
        {
            reason: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        required: true,
        enum: payroll_type_1.EPayrollStatus,
        default: payroll_type_1.EPayrollStatus.ACTIVE,
    },
}, {
    timestamps: true,
});
// index for faster search
payrollSchema.index({ employee_id: 1 });
exports.Payroll = (0, mongoose_1.model)("payroll", payrollSchema);
//# sourceMappingURL=payroll.model.js.map