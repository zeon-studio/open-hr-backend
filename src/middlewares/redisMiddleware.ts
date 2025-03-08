import redis from "@/lib/redisClient";
import { NextFunction, Request, Response } from "express";

const checkRedisConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redis.ping();
    next();
  } catch (error) {
    console.error("Redis connection error:", error);
    return res.status(503).json({ message: "Service temporarily unavailable" });
  }
};

export default checkRedisConnection;
