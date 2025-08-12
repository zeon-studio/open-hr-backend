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
exports.connectToDatabase = connectToDatabase;
exports.isDbConnected = isDbConnected;
exports.ensureDbConnected = ensureDbConnected;
const variables_1 = __importDefault(require("../config/variables"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoOptions = {
    // Be conservative on serverless
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 8000,
    retryWrites: true,
    retryReads: true,
    family: 4, // IPv4 to dodge some DNS issues
};
function connectWithRetry(uri_1, options_1) {
    return __awaiter(this, arguments, void 0, function* (uri, options, retries = 3, backoffMs = 1000) {
        let attempt = 0;
        // Simple linear backoff is fine here
        // Cache the in-flight promise globally so concurrent requests share it
        while (true) {
            try {
                return yield mongoose_1.default.connect(uri, options);
            }
            catch (err) {
                attempt++;
                if (attempt > retries)
                    throw err;
                yield new Promise((r) => setTimeout(r, backoffMs * attempt));
            }
        }
    });
}
function connectToDatabase() {
    if (!variables_1.default.database_uri) {
        throw new Error("MONGO_URI is not configured");
    }
    if (!global.__mongooseConn) {
        global.__mongooseConn = connectWithRetry(variables_1.default.database_uri, mongoOptions).catch((err) => {
            // Reset cache on failure so next request can retry
            global.__mongooseConn = null;
            throw err;
        });
    }
    return global.__mongooseConn;
}
function isDbConnected() {
    // 1 = connected, 2 = connecting
    return mongoose_1.default.connection.readyState === 1;
}
// Optional middleware to ensure connection per-request in serverless
function ensureDbConnected(_req, _res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isDbConnected()) {
                yield connectToDatabase();
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
//# sourceMappingURL=dbConnector.js.map