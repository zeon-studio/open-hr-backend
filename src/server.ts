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

const dbConnect = async () => {
  try {
    await mongoose.connect(config.database_uri as string);
    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.log("error occurred in db connection", error);
  }
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

dbConnect();

export default app;
