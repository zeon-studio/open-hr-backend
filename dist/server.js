"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const variables_1 = __importDefault(require("./config/variables"));
const dbConnector_1 = require("./lib/dbConnector");
const mongoose_1 = __importDefault(require("mongoose"));
// Only start a listener when running in a long-lived environment (local/dev).
// On Vercel (@vercel/node), export the app and let the platform handle it.
const isServerless = !!process.env.VERCEL;
let server;
process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.error("� Unhandled Promise Rejection:", err);
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        // Establish a connection once in long-lived envs to avoid first-request cold penalty.
        try {
            yield (0, dbConnector_1.connectToDatabase)();
            console.log("✅ MongoDB ready");
        }
        catch (err) {
            console.error("❌ Failed to connect to MongoDB during bootstrap", err);
            if (!isServerless)
                process.exit(1);
        }
        if (!isServerless) {
            server = app_1.default.listen(variables_1.default.port, () => {
                console.log(`🎉 Server running on http://localhost:${variables_1.default.port}`);
                console.log(`📊 Environment: ${variables_1.default.env}`);
                console.log(`🕒 Started at: ${new Date().toISOString()}`);
            });
            server.on("error", (err) => {
                console.error("❌ Server error:", err);
            });
        }
    });
}
function gracefulShutdown(signal) {
    console.log(`� ${signal} received. Shutting down gracefully...`);
    Promise.resolve()
        .then(() => new Promise((resolve) => {
        if (server) {
            server.close(() => {
                console.log("✅ HTTP server closed");
                resolve();
            });
        }
        else {
            resolve();
        }
    }))
        .then(() => mongoose_1.default.connection.close())
        .then(() => {
        console.log("✅ MongoDB connection closed");
        process.exit(0);
    })
        .catch((err) => {
        console.error("❌ Error during shutdown:", err);
        process.exit(1);
    });
}
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
// Only run bootstrap in non-serverless execution (local dev, PM2, etc.)
if (!isServerless) {
    bootstrap();
}
exports.default = app_1.default;
//# sourceMappingURL=server.js.map