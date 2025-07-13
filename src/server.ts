import app from "@/app";
import config from "@/config/variables";
import { Server } from "http";
import mongoose from "mongoose";

// Use process global to persist across module reloads
declare global {
  var __mongoConnected: boolean | undefined;
  var __serverStarted: boolean | undefined;
  var __appServer: Server | undefined;
}

// Only log if not already initialized
if (!global.__mongoConnected && !global.__serverStarted) {
  console.log("Server module loaded");
}

let server: Server;

if (config.env !== "development") {
  process.on("uncaughtException", (err) => {
    console.log(err);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM is received");
    if (server || global.__appServer) {
      (server || global.__appServer)?.close();
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
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
    global.__mongoConnected = true;
  });

  mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
    global.__mongoConnected = false;
  });
}

const dbConnect = async () => {
  // Check if already connected using mongoose state and global flag
  if (
    global.__mongoConnected ||
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    // Start server if not already started
    if (!global.__serverStarted && !global.__appServer) {
      server = app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
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

      await mongoose.connect(config.database_uri as string, mongoOptions);

      console.log("Successfully connected to MongoDB");
      global.__mongoConnected = true;

      // Start server if not already started
      if (!global.__serverStarted && !global.__appServer) {
        server = app.listen(config.port, () => {
          console.log(`Server running on port ${config.port}`);
          global.__serverStarted = true;
          global.__appServer = server;
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
      if (server || global.__appServer) {
        (server || global.__appServer)?.close(() => {
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
  if (server || global.__appServer) {
    (server || global.__appServer)?.close(() => {
      console.log("HTTP server closed.");
    });
  }
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  global.__mongoConnected = false;
  global.__serverStarted = false;
  global.__appServer = undefined;
  process.exit(0);
});

// Initialize connection only if not already connected
if (!global.__mongoConnected && mongoose.connection.readyState === 0) {
  dbConnect();
}

export default app;
