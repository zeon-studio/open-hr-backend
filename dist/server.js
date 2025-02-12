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
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(variables_1.default.database_uri);
        server = app_1.default.listen(variables_1.default.port, () => {
            console.log(`Server running on port ${variables_1.default.port}`);
        });
    }
    catch (error) {
        console.log("error occurred in db connection", error);
    }
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
dbConnect();
exports.default = app_1.default;
//# sourceMappingURL=server.js.map