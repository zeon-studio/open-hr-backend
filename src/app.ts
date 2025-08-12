import config from "@/config/variables";
import { globalErrorhandler } from "@/middlewares/globalErrorHandler";
import router from "@/routes";
import cors from "cors";
import express, { Application } from "express";
import { ensureDbConnected } from "./lib/dbConnector";

// Use process global to persist across module reloads
declare global {
  var __appLoaded: boolean | undefined;
}

if (!global.__appLoaded) {
  console.log("📦 Loading Express application...");
  global.__appLoaded = true;
}

const app: Application = express();

// CORS configuration
const isDevelopment = process.env.NODE_ENV === "development";
const corsOptions: cors.CorsOptions = {
  origin: isDevelopment
    ? "*"
    : config.cors_origin.split(",").map((origin) => origin.trim()),
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true, // Allow cookies if needed
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" })); // Add size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Ensure DB is connected per invocation in serverless
app.use(ensureDbConnected);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the backend",
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// API routes
app.use("/api/v1", router);

// Global error handler (must be last)
app.use(globalErrorhandler);

export default app;
