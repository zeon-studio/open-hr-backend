import config from "@/config/variables";
import { globalErrorhandler } from "@/middlewares/globalErrorHandler";
import router from "@/routes";
import cors from "cors";
import express, { Application } from "express";

const app: Application = express();

// Define CORS options for specific origins
const corsOptions: cors.CorsOptions =
  process.env.NODE_ENV === "development"
    ? {
        origin: "*",
        methods: "GET,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      }
    : {
        origin: config.cors_origin.split(",").map((origin) => origin.trim()),
        methods: "GET,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      };

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Welcome to the backend of Open HR");
});

app.use("/api/v1", router);

app.use(globalErrorhandler);

// Export the app for Vercel
export default app;
