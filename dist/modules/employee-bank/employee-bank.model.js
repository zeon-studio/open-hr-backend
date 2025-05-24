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
exports.EmployeeBank = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const employeeBankSchema = new mongoose_1.default.Schema({
    employee_id: {
        type: String,
        required: true,
    },
    banks: [
        {
            bank_name: {
                type: String,
                required: true,
            },
            bank_ac_name: {
                type: String,
                required: true,
            },
            bank_ac_no: {
                type: String,
                required: true,
            },
            bank_district: {
                type: String,
                required: true,
            },
            bank_branch: {
                type: String,
                required: true,
            },
            bank_routing_no: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
// index for faster search
employeeBankSchema.index({ employee_id: 1 });
exports.EmployeeBank = (0, mongoose_1.model)("employee_bank", employeeBankSchema);
//# sourceMappingURL=employee-bank.model.js.map