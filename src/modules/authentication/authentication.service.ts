import variables from "@/config/variables";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { mailSender } from "@/lib/mailSender";
import redis from "@/lib/redisClient";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import mongoose from "mongoose";
import { Employee } from "../employee/employee.model";
import { Authentication } from "./authentication.model";
import { AuthenticationType } from "./authentication.type";

// password login
const passwordLoginService = async (email: string, password: string) => {
  const isUserExist = await Employee.findOne({ work_email: email });

  if (!isUserExist) throw Error("User not found");

  const isMatch = await bcrypt.compare(
    password,
    isUserExist.password as string
  );

  if (!isMatch && isUserExist.password) {
    throw Error("Incorrect password");
  }

  const accessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role || "user",
    },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  const refreshToken = jwtHelpers.createRefreshToken(
    {
      id: isUserExist.id,
      role: isUserExist.role || "user",
    },
    variables.jwt_refresh_secret as Secret,
    variables.jwt_refresh_expire as string
  );

  // save refresh token to database
  await Authentication.updateOne(
    { user_id: isUserExist.id },
    { $set: { refresh_token: refreshToken } },
    { upsert: true, new: true }
  );

  return {
    accessToken,
    refreshToken,

    // token will expire in 60 seconds
    expiresAt: Date.now() + 60 * 1000,
    userId: isUserExist.id as string,
    name: isUserExist.name as string,
    email: isUserExist.work_email as string,
    image: isUserExist?.image as string,
    role: isUserExist.role as string,
  };
};

// oauth login
const oauthLoginService = async (email: string) => {
  const loginUser = await Employee.findOne({ work_email: email });

  if (!loginUser) {
    throw new Error("User not found");
  }

  const userDetails = {
    userId: loginUser.id,
    name: loginUser.name,
    email: loginUser.work_email,
    image: loginUser.image,
    role: loginUser.role || "user",
    accessToken: "",
    refreshToken: "",
  };

  const accessToken = jwtHelpers.createToken(
    { user_id: loginUser.id, role: loginUser.role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  const refreshToken = jwtHelpers.createRefreshToken(
    { user_id: loginUser.id, role: loginUser.role },
    variables.jwt_refresh_secret as Secret,
    variables.jwt_refresh_expire as string
  );

  // save refresh token to database
  await Authentication.updateOne(
    { user_id: loginUser.id },
    { $set: { refresh_token: refreshToken } },
    { upsert: true, new: true }
  );

  userDetails.accessToken = accessToken;
  userDetails.refreshToken = refreshToken;

  return userDetails;
};

// token login
const tokenLoginService = async (token: string) => {
  const decodedToken = jwtHelpers.verifyToken(
    token,
    variables.jwt_secret as Secret
  );

  const userId = decodedToken.id;
  const employee = await Employee.findOne({ id: userId });

  if (!employee) {
    throw new Error("User not found");
  }

  const userDetails = {
    userId: employee.id,
    name: employee.name,
    email: employee.work_email,
    image: employee.image,
    role: employee.role || "user",
    accessToken: "",
    refreshToken: "",
  };

  const accessToken = jwtHelpers.createToken(
    { user_id: employee.id, role: employee.role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  const refreshToken = jwtHelpers.createRefreshToken(
    { user_id: employee.id, role: employee.role },
    variables.jwt_refresh_secret as Secret,
    variables.jwt_refresh_expire as string
  );

  // save refresh token to database
  await Authentication.updateOne(
    { user_id: employee.id },
    { $set: { refresh_token: refreshToken } },
    { upsert: true, new: true }
  );

  userDetails.accessToken = accessToken;
  userDetails.refreshToken = refreshToken;

  return userDetails;
};

// user verification for password recovery
const verifyUserService = async (email: string, currentTime: string) => {
  const isUserExist = await Employee.findOne({ work_email: email });
  if (!isUserExist) {
    throw Error("Something went wrong Try again");
  } else {
    await sendVerificationOtp(isUserExist.id!, email, currentTime);
    return isUserExist;
  }
};

// send verification otp
const sendVerificationOtp = async (
  id: string,
  email: string,
  currentTime: string
) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const getCurrentTime = new Date(currentTime);
  const expiringTime = new Date(
    getCurrentTime.setMinutes(getCurrentTime.getMinutes() + 5)
  ).toISOString();

  const userVerification = {
    pass_reset_token: {
      token: await bcrypt.hash(otp, variables.salt),
      expires: expiringTime,
    },
  };

  await Authentication.updateOne(
    { user_id: id },
    { $set: userVerification },
    { upsert: true, new: true }
  );

  await mailSender.otpSender(email, otp);
};

// verify otp
const verifyOtpService = async (
  email: string,
  otp: string,
  currentTime: string
) => {
  if (!otp && !email) {
    throw Error("Empty details are not allowed");
  } else {
    const user = await Employee.findOne({ work_email: email });
    const verificationToken = await Authentication.findOne({
      user_id: user?.id,
    });
    if (!verificationToken) {
      throw Error("OTP not found");
    } else {
      const userId = verificationToken.user_id;
      const { token: hashedOtp, expires } = verificationToken.pass_reset_token;

      // Check if the OTP is still valid
      if (new Date(expires) > new Date(currentTime)) {
        const compareOtp = await bcrypt.compare(otp, hashedOtp);
        await Employee.updateOne({ id: userId }, { $set: { verified: true } });

        // Check if the OTP is correct
        if (!compareOtp) {
          throw Error("Incorrect OTP!");
        }

        // Check if the OTP has expired
      } else {
        throw Error("OTP Expired");
      }
    }
  }
};

// reset password
const resetPasswordService = async (email: string, password: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const hashedPassword = await bcrypt.hash(password, variables.salt);
    const resetPassword = await Employee.findOneAndUpdate(
      { work_email: email },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { session, new: true }
    );

    if (!resetPassword) {
      throw new Error("Something went wrong");
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

// update password
const updatePasswordService = async (
  id: string,
  current_password: string,
  new_password: string
) => {
  const user = await Employee.findOne({ id: id });

  if (!user) {
    throw new Error("Something went wrong");
  }

  if (user.password) {
    const isMatch = await bcrypt.compare(current_password, user.password);

    if (!isMatch) {
      throw new Error("Incorrect password");
    }
  }

  const hashedPassword = await bcrypt.hash(new_password, variables.salt);

  await Employee.updateOne(
    { id: id },
    {
      $set: {
        password: hashedPassword,
      },
    },
    { new: true, upsert: true }
  );
};

// reset password otp
const resetPasswordOtpService = async (
  id: string
): Promise<AuthenticationType | null> => {
  if (!id) {
    throw Error("Invalid request");
  } else {
    const isUserOtp = await Authentication.findOne({
      user_id: id,
    });

    if (!isUserOtp) {
      throw Error("Invalid user_id");
    } else {
      return isUserOtp;
    }
  }
};

// resend verification token
const resendOtpService = async (email: string, currentTime: string) => {
  const user = await Employee.findOne({ work_email: email });
  const user_id = user?.id;
  if (!email) {
    throw Error("Empty user information");
  } else {
    await sendVerificationOtp(user_id, email, currentTime);
  }
};

// create refresh token
const createRefreshToken = (id: string, role: string) => {
  return jwtHelpers.createRefreshToken(
    { id, role },
    variables.jwt_refresh_secret as Secret,
    variables.jwt_refresh_expire
  );
};

// verify refresh token
const verifyRefreshToken = (token: string) => {
  return jwtHelpers.verifyRefreshToken(
    token,
    variables.jwt_refresh_secret as Secret
  );
};

//

const THROTTLE_CONFIG = {
  maxAttempts: variables.env === "development" ? Infinity : 5,
  windowSeconds: 60,
  lockoutDurationSeconds: 300,
  keyPrefix: "refresh:throttle:",
};

const getRedisKeys = (userId: string) => ({
  attemptsKey: `${THROTTLE_CONFIG.keyPrefix}${userId}:attempts`,
  lockKey: `${THROTTLE_CONFIG.keyPrefix}${userId}:lock`,
});

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  // Create a new refresh promise and store it
  const decodedToken = verifyRefreshToken(refreshToken);
  const { id: userId, role } = decodedToken as { id: string; role: string };
  if (!userId) {
    throw new Error("Invalid refresh token");
  }
  const isExit = await redis.get(refreshToken);

  if (isExit) {
    return JSON.parse(isExit);
  }

  const { attemptsKey, lockKey } = getRedisKeys(userId);
  if (await redis.get(lockKey)) {
    const ttl = await redis.ttl(lockKey);
    throw new Error(`Too many requests. Try again in ${ttl} seconds.`);
  }

  const now = Date.now();
  await redis.zadd(attemptsKey, now, now);
  await redis.expire(attemptsKey, THROTTLE_CONFIG.windowSeconds * 2);
  await redis.zremrangebyscore(
    attemptsKey,
    0,
    now - THROTTLE_CONFIG.windowSeconds * 1000
  );

  const attemptCount = await redis.zcard(attemptsKey);

  if (attemptCount > THROTTLE_CONFIG.maxAttempts) {
    await redis.set(lockKey, "1", "EX", THROTTLE_CONFIG.lockoutDurationSeconds);
    throw new Error("Too many attempts. Try again later.");
  }

  const storedToken = await Authentication.findOne({ user_id: userId });
  if (!storedToken || storedToken.refresh_token !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      id: userId,
      role: role || "user",
    },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  const newRefreshToken = jwt.sign(
    { id: userId, role: role || "user" },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  await Authentication.updateOne(
    { user_id: userId },
    { refresh_token: newRefreshToken }
  );

  await redis.psetex(
    refreshToken,
    10 * 1000,
    JSON.stringify({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  );

  await redis.del(attemptsKey);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// export services
export const authenticationService = {
  passwordLoginService,
  oauthLoginService,
  tokenLoginService,
  verifyUserService,
  resendOtpService,
  verifyOtpService,
  resetPasswordService,
  updatePasswordService,
  resetPasswordOtpService,
  createRefreshToken,
  verifyRefreshToken,
  refreshTokenService,
};
