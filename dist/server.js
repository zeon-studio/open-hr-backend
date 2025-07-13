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
console.log("Server module loaded");
let server;
let isConnected = false;
let isServerStarted = false;
if (variables_1.default.env !== "development") {
    // detect unhandled exceptions
    process.on("uncaughtException", (err) => {
        console.log(err);
    });
    // create signal when server is closed
    process.on("SIGTERM", () => {
        console.log("SIGTERM is received");
        if (server) {
            server.close();
        }
    });
}
// MongoDB connection options
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
// Set up MongoDB event listeners once
mongoose_1.default.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
    isConnected = true;
});
mongoose_1.default.connection.on("error", (err) => {
    console.log("Mongoose connection error:", err);
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
    isConnected = false;
});
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    // Prevent multiple connection attempts
    if (isConnected || mongoose_1.default.connection.readyState === 1) {
        console.log("MongoDB already connected, skipping connection attempt");
        // Start server if not already started
        if (!isServerStarted && !server) {
            server = app_1.default.listen(variables_1.default.port, () => {
                console.log(`Server running on port ${variables_1.default.port}`);
                isServerStarted = true;
            });
        }
        return;
    }
    let retries = 5;
    while (retries > 0) {
        try {
            console.log(`Attempting to connect to MongoDB... (${6 - retries}/5)`);
            yield mongoose_1.default.connect(variables_1.default.database_uri, mongoOptions);
            console.log("Successfully connected to MongoDB");
            isConnected = true;
            // Only start server once connection is established and if not already started
            if (!isServerStarted && !server) {
                server = app_1.default.listen(variables_1.default.port, () => {
                    console.log(`Server running on port ${variables_1.default.port}`);
                    isServerStarted = true;
                });
            }
            break;
        }
        catch (error) {
            console.log(`MongoDB connection attempt ${6 - retries} failed:`, error);
            retries--;
            if (retries === 0) {
                console.log("All MongoDB connection attempts failed. Exiting...");
                process.exit(1);
            }
            yield new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
    if (variables_1.default.env !== "development") {
        process.on("unhandledRejection", (err) => {
            console.log("unhandled rejection occur closing the server...");
            if (server) {
                server.close(() => {
                    console.log(err);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    }
});
// Graceful shutdown
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("SIGINT received. Shutting down gracefully...");
    if (server) {
        server.close(() => {
            console.log("HTTP server closed.");
        });
    }
    yield mongoose_1.default.connection.close();
    console.log("MongoDB connection closed.");
    isConnected = false;
    isServerStarted = false;
    process.exit(0);
}));
// Initialize connection only once
if (!isConnected && mongoose_1.default.connection.readyState === 0) {
    dbConnect();
}
exports.default = app_1.default;
//# sourceMappingURL=server.js.map