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
exports.Setting = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const settingSchema = new mongoose_1.default.Schema({
    app_name: {
        type: String,
        required: true,
        default: "ERP Solution",
    },
    app_url: {
        type: String,
        required: true,
        default: "https://erp.teamosis.com",
    },
    favicon_url: {
        type: String,
        required: true,
        default: "https://themefisher.com/images/brands/logo_mark_gradient.png",
    },
    logo_url: {
        type: String,
        required: true,
        default: "https://themefisher.com/images/brands/full_logo_gradient_dark.png",
    },
    logo_width: {
        type: Number,
        required: true,
        default: 166,
    },
    logo_height: {
        type: Number,
        required: true,
        default: 36,
    },
    company_name: {
        type: String,
        required: true,
        default: "Themefisher",
    },
    company_website: {
        type: String,
        required: true,
        default: "https://themefisher.com",
    },
    menus: [
        {
            name: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            access: {
                type: [String],
                required: true,
            },
        },
    ],
    weekends: {
        type: [String],
        required: true,
        default: ["Friday"],
    },
    conditional_weekends: [
        {
            name: {
                type: String,
            },
            pattern: {
                type: [Number],
            },
        },
    ],
    leaves: [
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
    onboarding_tasks: [
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
    offboarding_tasks: [
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
exports.Setting = (0, mongoose_1.model)("setting", settingSchema);
//# sourceMappingURL=setting.model.js.map