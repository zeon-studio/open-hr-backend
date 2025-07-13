import app from "@/app";
import config from "@/config/variables";
import { Server } from "http";
import mongoose from "mongoose";

console.log("Server module loaded");

let server: Server;
let isConnected = false;
let isServerStarted = false;

if (config.env !== "development") {
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
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
  isConnected = true;
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
  isConnected = false;
});

const dbConnect = async () => {
  // Prevent multiple connection attempts
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected, skipping connection attempt");

    // Start server if not already started
    if (!isServerStarted && !server) {
      server = app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
        isServerStarted = true;
      });
    }
    return;
  }

  let retries = 5;

  while (retries > 0) {
    try {
      console.log(`Attempting to connect to MongoDB... (${6 - retries}/5)`);

      await mongoose.connect(config.database_uri as string, mongoOptions);

      console.log("Successfully connected to MongoDB");
      isConnected = true;

      // Only start server once connection is established and if not already started
      if (!isServerStarted && !server) {
        server = app.listen(config.port, () => {
          console.log(`Server running on port ${config.port}`);
          isServerStarted = true;
        });
      }

      break;
    } catch (error) {
      console.log(`MongoDB connection attempt ${6 - retries} failed:`, error);
      retries--;

      if (retries === 0) {
        console.log("All MongoDB connection attempts failed. Exiting...");
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (config.env !== "development") {
    process.on("unhandledRejection", (err) => {
      console.log("unhandled rejection occur closing the server...");
      if (server) {
        server.close(() => {
          console.log(err);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
    });
  }
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  isConnected = false;
  isServerStarted = false;
  process.exit(0);
});

// Initialize connection only once
if (!isConnected && mongoose.connection.readyState === 0) {
  dbConnect();
}

export default app;
