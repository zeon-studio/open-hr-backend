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
    console.log("Server module loaded");
}
let server;
if (variables_1.default.env !== "development") {
    process.on("uncaughtException", (err) => {
        console.log(err);
    });
    process.on("SIGTERM", () => {
        var _a;
        console.log("SIGTERM is received");
        if (server || global.__appServer) {
            (_a = (server || global.__appServer)) === null || _a === void 0 ? void 0 : _a.close();
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
// Set up MongoDB event listeners only once
if (!global.__mongoConnected) {
    mongoose_1.default.connection.on("connected", () => {
        console.log("Mongoose connected to MongoDB");
        global.__mongoConnected = true;
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.log("Mongoose connection error:", err);
    });
    mongoose_1.default.connection.on("disconnected", () => {
        console.log("Mongoose disconnected from MongoDB");
        global.__mongoConnected = false;
    });
}
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    // Check if already connected using mongoose state and global flag
    if (global.__mongoConnected ||
        mongoose_1.default.connection.readyState === 1 ||
        mongoose_1.default.connection.readyState === 2) {
        // Start server if not already started
        if (!global.__serverStarted && !global.__appServer) {
            server = app_1.default.listen(variables_1.default.port, () => {
                console.log(`Server running on port ${variables_1.default.port}`);
                global.__serverStarted = true;
                global.__appServer = server;
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
            global.__mongoConnected = true;
            // Start server if not already started
            if (!global.__serverStarted && !global.__appServer) {
                server = app_1.default.listen(variables_1.default.port, () => {
                    console.log(`Server running on port ${variables_1.default.port}`);
                    global.__serverStarted = true;
                    global.__appServer = server;
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
            var _a;
            console.log("unhandled rejection occur closing the server...");
            if (server || global.__appServer) {
                (_a = (server || global.__appServer)) === null || _a === void 0 ? void 0 : _a.close(() => {
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
    var _a;
    console.log("SIGINT received. Shutting down gracefully...");
    if (server || global.__appServer) {
        (_a = (server || global.__appServer)) === null || _a === void 0 ? void 0 : _a.close(() => {
            console.log("HTTP server closed.");
        });
    }
    yield mongoose_1.default.connection.close();
    console.log("MongoDB connection closed.");
    global.__mongoConnected = false;
    global.__serverStarted = false;
    global.__appServer = undefined;
    process.exit(0);
}));
// Initialize connection only if not already connected
if (!global.__mongoConnected && mongoose_1.default.connection.readyState === 0) {
    dbConnect();
}
exports.default = app_1.default;
//# sourceMappingURL=server.js.map