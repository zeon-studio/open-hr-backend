import variables from "@/config/variables";
import { jwtHelpers } from "@/lib/jwtTokenHelper";
import { mailSender } from "@/lib/mailSender";
import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
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
      role: isUserExist.role,
    },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  return {
    accessToken,
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
  };
  const token = jwtHelpers.createToken(
    { user_id: loginUser.id, role: loginUser.role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  userDetails.accessToken = token;

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
  };

  const accessToken = jwtHelpers.createToken(
    { user_id: employee.id, role: employee.role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  userDetails.accessToken = accessToken;
  return userDetails;
};

// user verification for password recovery
const verifyUserService = async (email: string, currentTime: string) => {
  const isUserExist = await Employee.findOne({ work_email: email });
  if (!isUserExist) {
    throw Error("Something went wrong Try again");
  } else {
    await Authentication.deleteOne({ user_id: isUserExist.id });
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

  const userVerification = new Authentication({
    user_id: id,
    token: await bcrypt.hash(otp, variables.salt),
    expires: expiringTime,
  });
  await userVerification.save();
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
      const { token: hashedOtp, expires } = verificationToken;
      if (new Date(expires) > new Date(currentTime)) {
        const compareOtp = await bcrypt.compare(otp, hashedOtp);
        await Employee.updateOne({ id: userId }, { $set: { verified: true } });
        if (!compareOtp) {
          throw Error("Incorrect OTP!");
        } else {
          await Authentication.deleteOne({ user_id: userId });
        }
      } else {
        await Authentication.deleteOne({ user_id: userId });
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

    await Authentication.deleteOne({ user_id: resetPassword.id });

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
    await Authentication.deleteMany({ user_id });
    await sendVerificationOtp(user_id, email, currentTime);
  }
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
