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
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Define CORS options for specific origins
const corsProtectedOptions = process.env.NODE_ENV === "development"
    ? {
        origin: "*",
        methods: "GET,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }
    : {
        origin: ["https://erp.teamosis.com", "tf-erp-solution.vercel.app"],
        methods: "GET,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    };
// Define CORS for all origin
const corsUnprotectedOptions = {
    origin: "*",
    methods: "GET,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
// Middleware to conditionally apply CORS
const conditionalCors = (req, res, next) => {
    const unprotectedPaths = ["/api/v1/test/public"];
    if (unprotectedPaths.some((path) => req.path.startsWith(path))) {
        (0, cors_1.default)(corsUnprotectedOptions)(req, res, next);
    }
    else {
        (0, cors_1.default)(corsProtectedOptions)(req, res, next);
    }
};
// Use the CORS middleware conditionally
app.use(conditionalCors);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Welcome to the backend of Teamosis ERP");
}));
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.globalErrorhandler);
// Export the app for Vercel
exports.default = app;
//# sourceMappingURL=app.js.map