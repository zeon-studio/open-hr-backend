import variables from "@/config/variables";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { mailSender } from "@/lib/mailSender";
import bcrypt from "bcrypt";
import { JwtPayload, Secret } from "jsonwebtoken";
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

  // Update with upsert to avoid race conditions
  await Authentication.findOneAndUpdate(
    { user_id: isUserExist.id },
    { $set: { refresh_token: refreshToken } },
    { upsert: true, new: true }
  );

  const userDetails = {
    userId: isUserExist.id as string,
    name: isUserExist.name as string,
    email: isUserExist.work_email as string,
    image: isUserExist?.image as string,
    role: isUserExist.role as string,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  return userDetails;
};

// oauth login
const oauthLoginService = async (email: string) => {
  const isUserExist = await Employee.findOne({ work_email: email });

  if (!isUserExist) {
    throw new Error("User not found");
  }

  const userDetails = {
    userId: isUserExist.id,
    name: isUserExist.name,
    email: isUserExist.work_email,
    image: isUserExist.image,
    role: isUserExist.role,
    accessToken: "",
    refreshToken: "",
  };

  const accessToken = jwtHelpers.createToken(
    { user_id: isUserExist.id, role: isUserExist.role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  const refreshToken = jwtHelpers.createToken(
    { user_id: isUserExist.id, role: isUserExist.role },
    variables.jwt_refresh_secret as Secret,
    variables.jwt_refresh_expire as string
  );

  // save refresh token to database
  await Authentication.findOneAndUpdate(
    { user_id: isUserExist.id },
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
  await Authentication.findOneAndUpdate(
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
      const { token: hashedOtp, expires } =
        verificationToken.pass_reset_token || {};

      // Check if the OTP is still valid
      if (expires && new Date(expires) > new Date(currentTime)) {
        if (!hashedOtp) {
          throw new Error("OTP not found");
        }
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

// Create a more robust cache with proper namespacing
const refreshTokenCache = new NodeCache({ stdTTL: 10 });

// refresh token service
export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  try {
    // Log the token (first few chars only for security)
    console.log(
      `Refreshing token starting with: ${refreshToken.substring(0, 8)}...`
    );

    // Explicitly log your secrets (first few chars only)
    console.log(
      `JWT Refresh Secret begins with: ${variables.jwt_refresh_secret!.toString().substring(0, 3)}...`
    );

    // Try to verify with detailed error handling
    let decodedToken: JwtPayload;
    try {
      decodedToken = jwtHelpers.verifyToken(
        refreshToken,
        variables.jwt_refresh_secret as Secret
      );
      console.log("Token verified successfully");
    } catch (verifyError: any) {
      console.error("Token verification failed:", verifyError.message);
      console.error("Token verification error type:", verifyError.name);
      throw new Error(`Token verification error: ${verifyError.message}`);
    }

    const { id: userId, role } = decodedToken;
    if (!userId) {
      console.error("No userId in decoded token");
      throw new Error("Invalid token payload");
    }

    console.log(`Looking up token for user: ${userId}`);

    // Find user's token in database with detailed error handling
    let storedToken:
      | (mongoose.Document<unknown, {}, AuthenticationType> &
          AuthenticationType & { _id: mongoose.Types.ObjectId } & {
            __v: number;
          })
      | null;
    try {
      storedToken = await Authentication.findOne({ user_id: userId });
      console.log(
        `Database lookup result: ${storedToken ? "Found" : "Not found"}`
      );
    } catch (dbError: any) {
      console.error("Database error:", dbError.message);
      throw new Error(`Database error: ${dbError.message}`);
    }

    if (!storedToken) {
      throw new Error("Authentication record not found");
    }

    console.log(
      `Stored token match check: ${storedToken.refresh_token === refreshToken}`
    );

    if (storedToken.refresh_token !== refreshToken) {
      console.error(
        "Token mismatch - Stored:",
        storedToken.refresh_token.substring(0, 8)
      );
      console.error("Token mismatch - Received:", refreshToken.substring(0, 8));
      throw new Error("Token mismatch in database");
    }

    // Generate new tokens with explicit durations
    console.log("Generating new tokens");
    const newAccessToken = jwtHelpers.createToken(
      {
        id: userId,
        role: role,
      },
      variables.jwt_secret as Secret,
      variables.jwt_expire as string
    );

    const newRefreshToken = jwtHelpers.createToken(
      {
        id: userId,
        role: role,
      },
      variables.jwt_refresh_secret as Secret,
      variables.jwt_refresh_expire as string
    );

    // Update database with both tokens for better tracing
    try {
      await Authentication.findOneAndUpdate(
        { user_id: userId },
        {
          refresh_token: newRefreshToken,
        },
        { new: true }
      );
      console.log("Database updated successfully");
    } catch (updateError: any) {
      console.error("Database update error:", updateError.message);
      throw new Error(`Database update error: ${updateError.message}`);
    }

    console.log("Refresh completed successfully");
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error: any) {
    // Log the full error with stack trace
    console.error("Refresh token complete error:", error);
    console.error("Error stack:", error.stack);
    throw new Error(`Refresh token error: ${error.message}`);
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
