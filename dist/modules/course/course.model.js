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
exports.Course = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const course_type_1 = require("./course.type");
const courseSchema = new mongoose_1.default.Schema({
    platform: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    courses: [
        {
            name: {
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
                enum: course_type_1.ECurrency,
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
// index for faster search
courseSchema.index({ platform: 1 });
exports.Course = (0, mongoose_1.model)("course", courseSchema);
//# sourceMappingURL=course.model.js.map