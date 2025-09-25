// Runtime bootstrap for Vercel when running TypeScript sources.
import fs from "fs";
import Module from "module";
import mongoose from "mongoose";
import path from "path";
import app from "./app";
import config from "./config/variables";

const originalResolve = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (
  request: string,
  parent: any,
  isMain: any,
  options: any
) {
  if (typeof request === "string" && request.startsWith("@/")) {
    const rel = request.slice(2); // remove '@/'
    const mappedBase = path.join(process.cwd(), "src", rel);

    // Try common candidates with extensions and index files.
    const candidates = [
      mappedBase,
      mappedBase + ".js",
      mappedBase + ".ts",
      path.join(mappedBase, "index.js"),
      path.join(mappedBase, "index.ts"),
    ];

    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate)) {
          return originalResolve.call(this, candidate, parent, isMain, options);
        }
      } catch (e) {
        // ignore and continue
      }
    }

    // If none found, fall back to resolving the bare mappedBase (Node resolver may still find it)
    try {
      return originalResolve.call(this, mappedBase, parent, isMain, options);
    } catch (e) {
      // fall through to default resolution which will produce the original error
    }
  }
  return originalResolve.call(this, request, parent, isMain, options);
};

// Ensure mongoose connection is established on cold start and reused across invocations.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __mongoConnectPromise: any;
}

if (!global.__mongoConnectPromise) {
  console.log("Initializing MongoDB connection...");
  global.__mongoConnectPromise = mongoose
    .connect(config.database_uri as string)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
}

// Middleware to wait for DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await global.__mongoConnectPromise;
    next();
  } catch (err) {
    next(err);
  }
});

export default app;
