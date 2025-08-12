import app from "@/app";
import config from "@/config/variables";
import { connectToDatabase } from "@/lib/dbConnector";
import { Server } from "http";
import mongoose from "mongoose";

// Only start a listener when running in a long-lived environment (local/dev).
// On Vercel (@vercel/node), export the app and let the platform handle it.
const isServerless = !!process.env.VERCEL;

let server: Server | undefined;

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("� Unhandled Promise Rejection:", err);
});

async function bootstrap() {
  // Establish a connection once in long-lived envs to avoid first-request cold penalty.
  try {
    await connectToDatabase();
    console.log("✅ MongoDB ready");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB during bootstrap", err);
    if (!isServerless) process.exit(1);
  }

  if (!isServerless) {
    server = app.listen(config.port, () => {
      console.log(`🎉 Server running on http://localhost:${config.port}`);
      console.log(`📊 Environment: ${config.env}`);
      console.log(`🕒 Started at: ${new Date().toISOString()}`);
    });

    server.on("error", (err) => {
      console.error("❌ Server error:", err);
    });
  }
}

function gracefulShutdown(signal: string) {
  console.log(`� ${signal} received. Shutting down gracefully...`);
  Promise.resolve()
    .then(
      () =>
        new Promise<void>((resolve) => {
          if (server) {
            server.close(() => {
              console.log("✅ HTTP server closed");
              resolve();
            });
          } else {
            resolve();
          }
        })
    )
    .then(() => mongoose.connection.close())
    .then(() => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error during shutdown:", err);
      process.exit(1);
    });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Only run bootstrap in non-serverless execution (local dev, PM2, etc.)
if (!isServerless) {
  bootstrap();
}

export default app;
