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
const leave_request_type_1 = require("../leave-request/leave-request.type");
const setting_type_1 = require("./setting.type");
const settingSchema = new mongoose_1.default.Schema({
    app_name: {
        type: String,
        required: true,
    },
    app_url: {
        type: String,
        required: true,
    },
    favicon_url: {
        type: String,
    },
    logo_url: {
        type: String,
    },
    logo_width: {
        type: Number,
    },
    logo_height: {
        type: Number,
    },
    company_name: {
        type: String,
        required: true,
    },
    company_website: {
        type: String,
        required: true,
    },
    communication_platform: {
        type: String,
        required: true,
    },
    communication_platform_url: {
        type: String,
        required: true,
    },
    max_leave_per_day: {
        type: Number,
        required: true,
    },
    leave_threshold_days: {
        type: Number,
        required: true,
    },
    modules: [
        {
            name: {
                type: String,
                required: true,
                enum: setting_type_1.EModule,
            },
            description: {
                type: String,
            },
            enable: {
                type: Boolean,
                required: true,
            },
        },
    ],
    weekends: {
        type: [String],
        required: true,
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
                enum: leave_request_type_1.ELeaveRequestType,
            },
            days: {
                type: Number,
                required: true,
            },
        },
    ],
    payroll: {
        basic: {
            type: String,
            required: true,
        },
        house_rent: {
            type: String,
            required: true,
        },
        conveyance: {
            type: String,
            required: true,
        },
        medical: {
            type: String,
            required: true,
        },
    },
    onboarding_tasks: [
        {
            name: {
                type: String,
                required: true,
            },
            assigned_to: {
                type: String,
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
            assigned_to: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
exports.Setting = (0, mongoose_1.model)("setting", settingSchema);
//# sourceMappingURL=setting.model.js.map