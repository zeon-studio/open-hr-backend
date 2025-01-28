import { globalErrorhandler } from "@/middlewares/globalErrorHandler";
import router from "@/routes";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();

// Define CORS options for specific origins
const corsProtectedOptions: cors.CorsOptions =
  process.env.NODE_ENV === "development"
    ? {
        origin: "*",
        methods: "GET,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      }
    : {
        origin: [
          "https://erp.teamosis.com",
          "https://tf-erp-solution.vercel.app",
        ],
        methods: "GET,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      };

// Define CORS for all origin
const corsUnprotectedOptions: cors.CorsOptions = {
  origin: "*",
  methods: "GET,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware to conditionally apply CORS
const conditionalCors = (req: Request, res: Response, next: NextFunction) => {
  const unprotectedPaths = ["/api/v1/test/public"];

  if (unprotectedPaths.some((path) => req.path.startsWith(path))) {
    cors(corsUnprotectedOptions)(req, res, next);
  } else {
    cors(corsProtectedOptions)(req, res, next);
  }
};

// Use the CORS middleware conditionally
app.use(conditionalCors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Welcome to the backend of Teamosis ERP");
});

app.use("/api/v1", router);

app.use(globalErrorhandler);

// Export the app for Vercel
export default app;
