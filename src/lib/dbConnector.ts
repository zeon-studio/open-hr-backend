import config from "@/config/variables";
import mongoose, { ConnectOptions } from "mongoose";

// Augment global for serverless/hot-reload safe singleton
declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | null | undefined;
}

const mongoOptions: ConnectOptions = {
  // Be conservative on serverless
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
  maxPoolSize: 5,
  minPoolSize: 0,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 8000,
  retryWrites: true,
  retryReads: true,
  family: 4, // IPv4 to dodge some DNS issues
};

async function connectWithRetry(
  uri: string,
  options: ConnectOptions,
  retries = 3,
  backoffMs = 1000
): Promise<typeof mongoose> {
  let attempt = 0;
  // Simple linear backoff is fine here
  // Cache the in-flight promise globally so concurrent requests share it
  while (true) {
    try {
      return await mongoose.connect(uri, options);
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      await new Promise((r) => setTimeout(r, backoffMs * attempt));
    }
  }
}

export function connectToDatabase(): Promise<typeof mongoose> {
  if (!config.database_uri) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!global.__mongooseConn) {
    global.__mongooseConn = connectWithRetry(
      config.database_uri as string,
      mongoOptions
    ).catch((err) => {
      // Reset cache on failure so next request can retry
      global.__mongooseConn = null;
      throw err;
    });
  }

  return global.__mongooseConn as Promise<typeof mongoose>;
}

export function isDbConnected(): boolean {
  // 1 = connected, 2 = connecting
  return mongoose.connection.readyState === 1;
}

// Optional middleware to ensure connection per-request in serverless
export async function ensureDbConnected(
  _req: any,
  _res: any,
  next: (err?: unknown) => void
) {
  try {
    if (!isDbConnected()) {
      await connectToDatabase();
    }
    next();
  } catch (err) {
    next(err);
  }
}
