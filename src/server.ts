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
  console.log("🚀 Initializing ERP Solution Backend...");
}

let server: Server;

// Production error handling
if (config.env !== "development") {
  process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    process.exit(1);
  });

  process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received. Shutting down gracefully...");
    if (server || global.__appServer) {
      (server || global.__appServer)?.close(() => {
        console.log("✅ HTTP server closed");
        process.exit(0);
      });
    }
  });
}

// MongoDB configuration
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

// MongoDB event listeners (set only once)
if (!global.__mongoConnected) {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully");
    global.__mongoConnected = true;
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️  MongoDB disconnected");
    global.__mongoConnected = false;
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
    global.__mongoConnected = true;
  });
}

const startServer = () => {
  if (!global.__serverStarted && !global.__appServer) {
    server = app.listen(config.port, () => {
      console.log(`🎉 Server running on http://localhost:${config.port}`);
      console.log(`📊 Environment: ${config.env}`);
      console.log(`🕒 Started at: ${new Date().toISOString()}`);
      global.__serverStarted = true;
      global.__appServer = server;
    });

    // Handle server errors
    server.on("error", (err) => {
      console.error("❌ Server error:", err);
    });
  }
};

const dbConnect = async () => {
  // Check connection state
  const isConnected =
    global.__mongoConnected ||
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2;

  if (isConnected) {
    startServer();
    return;
  }

  let retries = 5;
  while (retries > 0) {
    try {
      console.log(`🔄 Connecting to MongoDB... (attempt ${6 - retries}/5)`);

      await mongoose.connect(config.database_uri as string, mongoOptions);

      console.log("✅ MongoDB connection established");
      global.__mongoConnected = true;

      startServer();
      break;
    } catch (error) {
      console.error(
        `❌ MongoDB connection failed (attempt ${6 - retries}/5):`,
        error
      );
      retries--;

      if (retries === 0) {
        console.error(
          "💥 All MongoDB connection attempts failed. Shutting down..."
        );
        process.exit(1);
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Production error handling
  if (config.env !== "development") {
    process.on("unhandledRejection", (err) => {
      console.error("💥 Unhandled Promise Rejection:", err);
      if (server || global.__appServer) {
        (server || global.__appServer)?.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  }
};

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`🛑 ${signal} received. Shutting down gracefully...`);

  try {
    // Close HTTP server
    if (server || global.__appServer) {
      await new Promise<void>((resolve) => {
        (server || global.__appServer)?.close(() => {
          console.log("✅ HTTP server closed");
          resolve();
        });
      });
    }

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");

    // Reset global flags
    global.__mongoConnected = false;
    global.__serverStarted = false;
    global.__appServer = undefined;

    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Register shutdown handlers
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Initialize database connection
if (!global.__mongoConnected && mongoose.connection.readyState === 0) {
  dbConnect();
}

export default app;
