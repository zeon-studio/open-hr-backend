import variables from "@/config/variables";
import ApiError from "@/errors/ApiError";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { mailSender } from "@/lib/mailSender";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import mongoose from "mongoose";
import { Employee } from "../employee/employee.model";
import { Authentication } from "./authentication.model";
import { AuthenticationType } from "./authentication.type";

// Lazily-built Google OAuth client. We don't construct it at module load
// because deployments that don't use Google login shouldn't need the env var.
let _googleClient: OAuth2Client | null = null;
const googleClient = () => {
  if (!_googleClient) _googleClient = new OAuth2Client();
  return _googleClient;
};

// Helper function to create JWT token
const createJwtToken = (id: string, role: string) => {
  return jwtHelpers.createToken(
    { id, role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );
};

// Helper function to format user details
const formatUserDetails = (user: any, accessToken: string) => ({
  userId: user.id,
  name: user.name,
  email: user.work_email,
  image: user.image,
  role: user.role,
  accessToken,
});

// password login
const passwordLoginService = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await Employee.findOne({ work_email: email }).select(
    "+password"
  );
  if (!user) throw new Error("User not found");

  if (!user.password) {
    throw new Error(
      "Password not set for this user. Please use OAuth login or reset your password."
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  const accessToken = createJwtToken(user.id, user.role);
  return formatUserDetails(user, accessToken);
};

// oauth login
//
// SECURITY: The previous implementation accepted any email in the request
// body and issued a JWT for that email — i.e., any caller with network
// access to /oauth-login could log in as anyone. We now require a Google
// ID token, verify its signature against Google's public keys, and only
// trust the email contained in that verified token. Audience is pinned
// to our own GOOGLE_CLIENT_ID to reject tokens minted for other apps.
const oauthLoginService = async (idToken: string) => {
  if (!idToken) {
    throw new ApiError("idToken is required", httpStatus.BAD_REQUEST, "");
  }
  if (!variables.google_client_id) {
    throw new ApiError(
      "Google OAuth is not configured on this server (GOOGLE_CLIENT_ID missing)",
      httpStatus.SERVICE_UNAVAILABLE,
      ""
    );
  }

  let payload;
  try {
    const ticket = await googleClient().verifyIdToken({
      idToken,
      audience: variables.google_client_id,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new ApiError(
      "Invalid Google ID token",
      httpStatus.UNAUTHORIZED,
      ""
    );
  }

  if (!payload?.email || !payload.email_verified) {
    throw new ApiError(
      "Google ID token did not contain a verified email",
      httpStatus.UNAUTHORIZED,
      ""
    );
  }

  const user = await Employee.findOne({ work_email: payload.email });
  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND, "");
  }

  const accessToken = createJwtToken(user.id, user.role);
  return formatUserDetails(user, accessToken);
};

// token login
const tokenLoginService = async (token: string) => {
  if (!token) {
    throw new Error("Token is required");
  }

  const decodedToken = jwtHelpers.verifyToken(
    token,
    variables.jwt_secret as Secret
  );
  const user = await Employee.findOne({ id: decodedToken.id });

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = createJwtToken(user.id, user.role);
  return formatUserDetails(user, accessToken);
};

// user verification for password recovery
// NOTE: Do not trust client time. Server computes expiry based on its own clock.
const verifyUserService = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await Employee.findOne({ work_email: email });
  if (!user) {
    throw new Error("User not found");
  }

  await sendVerificationOtp(user.id!, email);
  return user;
};

// send verification otp
// Server computes expiration using its own clock to prevent client tampering.
const sendVerificationOtp = async (id: string, email: string) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const expiringTime = new Date(Date.now() + 5 * 60000).toISOString();

  const userVerification = {
    pass_reset_token: {
      token: await bcrypt.hash(otp, variables.salt),
      expires: expiringTime,
    },
  };

  await Authentication.updateOne(
    { user_id: id },
    { $set: userVerification },
    { upsert: true }
  );

  await mailSender.otpSender(email, otp);
};

// verify otp
const verifyOtpService = async (email: string, otp: string) => {
  if (!otp || !email) {
    throw new Error("Email and OTP are required");
  }

  const user = await Employee.findOne({ work_email: email });
  if (!user) {
    throw new Error("User not found");
  }

  const verificationToken = await Authentication.findOne({ user_id: user.id });
  if (!verificationToken?.pass_reset_token) {
    throw new Error("OTP not found or expired");
  }

  const { token: hashedOtp, expires } = verificationToken.pass_reset_token;

  // Compare against server time to avoid trusting client-provided time.
  if (!hashedOtp || !expires || new Date(expires) <= new Date()) {
    throw new Error("OTP expired");
  }

  const isOtpValid = await bcrypt.compare(otp, hashedOtp);
  if (!isOtpValid) {
    throw new Error("Incorrect OTP");
  }

  // Update user verification status
  await Employee.updateOne({ id: user.id }, { $set: { verified: true } });
};

// reset password
const resetPasswordService = async (
  email: string,
  password: string,
  reset_token: string
) => {
  if (!email || !password || !reset_token) {
    throw new Error("Email, Password and reset_token are required");
  }

  const user = await Employee.findOne({ work_email: email });
  if (!user) {
    throw new Error("User not found");
  }

  // Verify the OTP/reset_token first
  const verificationDoc = await Authentication.findOne({ user_id: user.id });
  if (!verificationDoc?.pass_reset_token) {
    throw new ApiError("OTP not found", httpStatus.FORBIDDEN, "");
  }

  const { token: hashedOtp, expires } = verificationDoc.pass_reset_token;
  const now = new Date();
  if (!hashedOtp || !expires || new Date(expires) <= now) {
    // remove expired token and fail
    await Authentication.updateOne(
      { user_id: user.id },
      { $unset: { pass_reset_token: "" } }
    );
    throw new ApiError("OTP Expired", httpStatus.FORBIDDEN, "");
  }

  const isOtpMatch = await bcrypt.compare(reset_token, hashedOtp);
  if (!isOtpMatch) {
    throw new ApiError("Incorrect OTP", httpStatus.FORBIDDEN, "");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const hashedPassword = await bcrypt.hash(password, variables.salt);
    const updatedUser = await Employee.findOneAndUpdate(
      { id: user.id },
      { $set: { password: hashedPassword } },
      { session, new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Remove the used reset token
    await Authentication.updateOne(
      { user_id: user.id },
      { $unset: { pass_reset_token: "" } },
      { session }
    );

    await session.commitTransaction();
    return updatedUser;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

// update password
const updatePasswordService = async (
  id: string,
  current_password: string,
  new_password: string
) => {
  if (!id || !current_password || !new_password) {
    throw new Error("All fields are required");
  }

  const user = await Employee.findOne({ id }).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  if (user.password) {
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }
  }

  const hashedPassword = await bcrypt.hash(new_password, variables.salt);
  await Employee.updateOne({ id }, { $set: { password: hashedPassword } });
};

// reset password otp
const resetPasswordOtpService = async (
  id: string
): Promise<AuthenticationType | null> => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const userOtp = await Authentication.findOne({ user_id: id });
  if (!userOtp) {
    throw new Error("OTP record not found");
  }

  return userOtp;
};

// resend verification token
const resendOtpService = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await Employee.findOne({ work_email: email });
  if (!user?.id) {
    throw new Error("User not found");
  }

  await sendVerificationOtp(user.id, email);
};

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
};
