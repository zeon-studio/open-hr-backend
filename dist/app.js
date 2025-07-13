"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = __importDefault(require("./config/variables"));
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
if (!global.__appLoaded) {
    console.log("📦 Loading Express application...");
    global.__appLoaded = true;
}
const app = (0, express_1.default)();
// CORS configuration
const isDevelopment = process.env.NODE_ENV === "development";
const corsOptions = {
    origin: isDevelopment
        ? "*"
        : variables_1.default.cors_origin.split(",").map((origin) => origin.trim()),
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Allow cookies if needed
};
// Middleware setup
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "10mb" })); // Add size limit
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the backend of Open HR",
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: variables_1.default.env,
    });
});
// API routes
app.use("/api/v1", routes_1.default);
// Global error handler (must be last)
app.use(globalErrorHandler_1.globalErrorhandler);
exports.default = app;
//# sourceMappingURL=app.js.map