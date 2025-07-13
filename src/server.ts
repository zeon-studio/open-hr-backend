import app from "@/app";
import config from "@/config/variables";
import { Server } from "http";
import mongoose from "mongoose";

let server: Server;

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
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain a minimum of 5 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  retryWrites: true,
  retryReads: true,
};

const dbConnect = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      console.log(`Attempting to connect to MongoDB... (${6 - retries}/5)`);

      await mongoose.connect(config.database_uri as string, mongoOptions);

      console.log("Successfully connected to MongoDB");

      server = app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
      });

      break; // Exit the retry loop on successful connection
    } catch (error) {
      console.log(`MongoDB connection attempt ${6 - retries} failed:`, error);
      retries--;

      if (retries === 0) {
        console.log("All MongoDB connection attempts failed. Exiting...");
        process.exit(1);
      }

      // Wait 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // MongoDB event listeners
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
  });

  if (config.env !== "development") {
    // stop server when unhandled promise rejections occur
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
  process.exit(0);
});

dbConnect();

export default app;
