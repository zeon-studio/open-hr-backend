import variables from "@/config/variables";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { mailSender } from "@/lib/mailSender";
import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import mongoose from "mongoose";
import { Employee } from "../employee/employee.model";
import { Authentication } from "./authentication.model";
import { AuthenticationType } from "./authentication.type";

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

  const user = await Employee.findOne({ work_email: email });
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
const oauthLoginService = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await Employee.findOne({ work_email: email });
  if (!user) {
    throw new Error("User not found");
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
const verifyUserService = async (email: string, currentTime: string) => {
  if (!email || !currentTime) {
    throw new Error("Email and current time are required");
  }

  const user = await Employee.findOne({ work_email: email });
  if (!user) {
    throw new Error("User not found");
  }

  await sendVerificationOtp(user.id!, email, currentTime);
  return user;
};

// send verification otp
const sendVerificationOtp = async (
  id: string,
  email: string,
  currentTime: string
) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const expiringTime = new Date(
    new Date(currentTime).getTime() + 5 * 60000
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
    { upsert: true }
  );

  await mailSender.otpSender(email, otp);
};

// verify otp
const verifyOtpService = async (
  email: string,
  otp: string,
  currentTime: string
) => {
  if (!otp || !email || !currentTime) {
    throw new Error("Email, OTP, and current time are required");
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

  if (!hashedOtp || !expires || new Date(expires) <= new Date(currentTime)) {
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
const resetPasswordService = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const hashedPassword = await bcrypt.hash(password, variables.salt);
    const updatedUser = await Employee.findOneAndUpdate(
      { work_email: email },
      { $set: { password: hashedPassword } },
      { session, new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    await session.commitTransaction();
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

  const user = await Employee.findOne({ id });
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
const resendOtpService = async (email: string, currentTime: string) => {
  if (!email || !currentTime) {
    throw new Error("Email and current time are required");
  }

  const user = await Employee.findOne({ work_email: email });
  if (!user?.id) {
    throw new Error("User not found");
  }

  await sendVerificationOtp(user.id, email, currentTime);
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
