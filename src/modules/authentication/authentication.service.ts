import variables from "@/config/variables";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { mailSender } from "@/lib/mailSender";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import mongoose from "mongoose";
import NodeCache from "node-cache";
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
      role: isUserExist.role,
    },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
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
    userId: isUserExist.id as string,
    name: isUserExist.name as string,
    email: isUserExist.work_email as string,
    image: isUserExist?.image as string,
    accessToken: accessToken,
    refreshToken: refreshToken,
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
    role: loginUser.role,
    accessToken: "",
    refreshToken: "",
  };

  const accessToken = jwtHelpers.createToken(
    { user_id: loginUser.id, role: loginUser.role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  const refreshToken = jwtHelpers.createToken(
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
    role: employee.role,
    accessToken: "",
    refreshToken: "",
  };

  const accessToken = jwtHelpers.createToken(
    { user_id: employee.id, role: employee.role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  const refreshToken = jwtHelpers.createToken(
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

const refreshTokenCache = new NodeCache({ stdTTL: 30 });
// Track recently issued tokens for each user
const userRecentTokensCache = new NodeCache({ stdTTL: 60 });

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  // Check if this exact token has a cached response
  const cached = refreshTokenCache.get(refreshToken);
  if (cached) {
    return cached;
  }

  try {
    // Verify the token is structurally valid
    const decodedToken = jwtHelpers.verifyToken(
      refreshToken,
      variables.jwt_refresh_secret as Secret
    );

    const { id: userId, role } = decodedToken;
    if (!userId) {
      throw new Error("Invalid refresh token - missing user ID");
    }

    // Get user's recent tokens (array of valid tokens)
    let recentTokens: string[] = userRecentTokensCache.get(userId) || [];

    // If this token is in the recent tokens list, it's valid even if not the latest
    const isRecentToken =
      Array.isArray(recentTokens) && recentTokens.includes(refreshToken);

    // Verify token exists in database
    const storedToken = await Authentication.findOne({ user_id: userId });
    if (!storedToken) {
      throw new Error("User not found in authentication records");
    }

    // Accept the token if either:
    // 1. It matches the current database token, OR
    // 2. It's in our list of recently issued tokens for this user
    if (storedToken.refresh_token !== refreshToken && !isRecentToken) {
      console.log("Token mismatch for user:", userId, {
        latestToken: storedToken.refresh_token.substring(0, 20) + "...", // Log partial token for debugging
      });

      // Add the current database token to our recent tokens list
      if (
        storedToken.refresh_token &&
        !recentTokens.includes(storedToken.refresh_token)
      ) {
        recentTokens = [storedToken.refresh_token, ...recentTokens].slice(0, 5); // Keep last 5 tokens
        userRecentTokensCache.set(userId, recentTokens);
      }

      throw new Error("Invalid refresh token - token mismatch");
    }

    // Generate new tokens
    const newAccessToken = jwtHelpers.createToken(
      {
        id: userId,
        role: role,
      },
      variables.jwt_secret as Secret,
      variables.jwt_expire as string
    );

    // @ts-ignore
    const newRefreshToken = jwt.sign(
      { id: userId, role: role },
      variables.jwt_refresh_secret as Secret,
      { expiresIn: variables.jwt_refresh_expire }
    );

    // Update the token in database
    // Note: We don't strictly check the previous token anymore to handle race conditions better
    const updatedAuth = await Authentication.findOneAndUpdate(
      { user_id: userId },
      { refresh_token: newRefreshToken },
      { new: true }
    );

    if (!updatedAuth) {
      throw new Error("Failed to update token record");
    }

    // Update the recent tokens list for this user
    recentTokens = [newRefreshToken, refreshToken, ...recentTokens].slice(0, 5); // Keep at most 5 recent tokens
    userRecentTokensCache.set(userId, recentTokens);

    const cacheData = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

    // Cache responses for both the incoming token and the new token
    refreshTokenCache.set(refreshToken, cacheData);
    refreshTokenCache.set(newRefreshToken, cacheData); // Pre-cache for the new token too

    return cacheData;
  } catch (error: any) {
    // Log the specific error for debugging but don't include sensitive data
    console.error("Refresh token error:", error.message);

    // Rethrow with a consistent user-facing message
    throw new Error("Invalid refresh token");
  }
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
  refreshTokenService,
};
