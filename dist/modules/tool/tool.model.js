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
exports.Tool = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const tool_type_1 = require("./tool.type");
const toolSchema = new mongoose_1.default.Schema({
    platform: {
        type: String,
        required: true,
        unique: true,
    },
    website: {
        type: String,
        required: true,
    },
    organizations: [
        {
            name: {
                type: String,
                required: true,
            },
            login_id: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
                default: 0,
            },
            currency: {
                type: String,
                required: true,
                enum: tool_type_1.ECurrency,
            },
            billing: {
                type: String,
                required: true,
                enum: tool_type_1.EBilling,
            },
            users: [
                {
                    type: String,
                },
            ],
            purchase_date: {
                type: Date,
            },
            expire_date: {
                type: Date,
            },
        },
    ],
}, {
    timestamps: true,
});
exports.Tool = (0, mongoose_1.model)("tool", toolSchema);
//# sourceMappingURL=tool.model.js.map