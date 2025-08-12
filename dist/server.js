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
const mongoose_1 = __importDefault(require("mongoose"));
// Only log if not already initialized
if (!global.__mongoConnected && !global.__serverStarted) {
    console.log("🚀 Initializing Backend...");
}
let server;
// Production error handling
if (variables_1.default.env !== "development") {
    process.on("uncaughtException", (err) => {
        console.error("💥 Uncaught Exception:", err);
        process.exit(1);
    });
    process.on("SIGTERM", () => {
        var _a;
        console.log("🛑 SIGTERM received. Shutting down gracefully...");
        if (server || global.__appServer) {
            (_a = (server || global.__appServer)) === null || _a === void 0 ? void 0 : _a.close(() => {
                console.log("✅ HTTP server closed");
                process.exit(0);
            });
        }
    });
}
// MongoDB configuration
const mongoOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
};
// MongoDB event listeners (set only once)
if (!global.__mongoConnected) {
    mongoose_1.default.connection.on("connected", () => {
        console.log("✅ MongoDB connected successfully");
        global.__mongoConnected = true;
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
    });
    mongoose_1.default.connection.on("disconnected", () => {
        console.log("⚠️  MongoDB disconnected");
        global.__mongoConnected = false;
    });
    mongoose_1.default.connection.on("reconnected", () => {
        console.log("🔄 MongoDB reconnected");
        global.__mongoConnected = true;
    });
}
const startServer = () => {
    if (!global.__serverStarted && !global.__appServer) {
        server = app_1.default.listen(variables_1.default.port, () => {
            console.log(`🎉 Server running on http://localhost:${variables_1.default.port}`);
            console.log(`📊 Environment: ${variables_1.default.env}`);
            console.log(`🕒 Started at: ${new Date().toISOString()}`);
            global.__serverStarted = true;
            global.__appServer = server;
        });
        // Handle server errors
        server.on("error", (err) => {
            console.error("❌ Server error:", err);
        });
    }
};
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    // Check connection state
    const isConnected = global.__mongoConnected ||
        mongoose_1.default.connection.readyState === 1 ||
        mongoose_1.default.connection.readyState === 2;
    if (isConnected) {
        startServer();
        return;
    }
    let retries = 5;
    while (retries > 0) {
        try {
            console.log(`🔄 Connecting to MongoDB... (attempt ${6 - retries}/5)`);
            yield mongoose_1.default.connect(variables_1.default.database_uri, mongoOptions);
            console.log("✅ MongoDB connection established");
            global.__mongoConnected = true;
            startServer();
            break;
        }
        catch (error) {
            console.error(`❌ MongoDB connection failed (attempt ${6 - retries}/5):`, error);
            retries--;
            if (retries === 0) {
                console.error("💥 All MongoDB connection attempts failed. Shutting down...");
                process.exit(1);
            }
            // Wait before retry
            yield new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
    // Production error handling
    if (variables_1.default.env !== "development") {
        process.on("unhandledRejection", (err) => {
            var _a;
            console.error("💥 Unhandled Promise Rejection:", err);
            if (server || global.__appServer) {
                (_a = (server || global.__appServer)) === null || _a === void 0 ? void 0 : _a.close(() => {
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    }
});
// Graceful shutdown handler
const gracefulShutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🛑 ${signal} received. Shutting down gracefully...`);
    try {
        // Close HTTP server
        if (server || global.__appServer) {
            yield new Promise((resolve) => {
                var _a;
                (_a = (server || global.__appServer)) === null || _a === void 0 ? void 0 : _a.close(() => {
                    console.log("✅ HTTP server closed");
                    resolve();
                });
            });
        }
        // Close MongoDB connection
        yield mongoose_1.default.connection.close();
        console.log("✅ MongoDB connection closed");
        // Reset global flags
        global.__mongoConnected = false;
        global.__serverStarted = false;
        global.__appServer = undefined;
        console.log("✅ Graceful shutdown completed");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
    }
});
// Register shutdown handlers
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
// Initialize database connection
if (!global.__mongoConnected && mongoose_1.default.connection.readyState === 0) {
    dbConnect();
}
exports.default = app_1.default;
//# sourceMappingURL=server.js.map