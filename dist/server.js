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
let server;
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
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 5, // Maintain a minimum of 5 socket connections
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    retryWrites: true,
    retryReads: true,
};
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    let retries = 5;
    while (retries > 0) {
        try {
            console.log(`Attempting to connect to MongoDB... (${6 - retries}/5)`);
            yield mongoose_1.default.connect(variables_1.default.database_uri, mongoOptions);
            console.log("Successfully connected to MongoDB");
            server = app_1.default.listen(variables_1.default.port, () => {
                console.log(`Server running on port ${variables_1.default.port}`);
            });
            break; // Exit the retry loop on successful connection
        }
        catch (error) {
            console.log(`MongoDB connection attempt ${6 - retries} failed:`, error);
            retries--;
            if (retries === 0) {
                console.log("All MongoDB connection attempts failed. Exiting...");
                process.exit(1);
            }
            // Wait 2 seconds before retrying
            yield new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
    // MongoDB event listeners
    mongoose_1.default.connection.on("connected", () => {
        console.log("Mongoose connected to MongoDB");
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.log("Mongoose connection error:", err);
    });
    mongoose_1.default.connection.on("disconnected", () => {
        console.log("Mongoose disconnected from MongoDB");
    });
    if (variables_1.default.env !== "development") {
        // stop server when unhandled promise rejections occur
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
    process.exit(0);
}));
dbConnect();
exports.default = app_1.default;
//# sourceMappingURL=server.js.map