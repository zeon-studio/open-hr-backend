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

  const userDetails = {
    userId: isUserExist.id as string,
    name: isUserExist.name as string,
    email: isUserExist.work_email as string,
    image: isUserExist?.image as string,
    role: isUserExist.role as string,
    accessToken: accessToken,
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
  };

  const accessToken = jwtHelpers.createToken(
    { id: isUserExist.id, role: isUserExist.role },
    variables.jwt_secret as Secret,
    variables.jwt_expire as string
  );

  userDetails.accessToken = accessToken;

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
  };

  const accessToken = jwtHelpers.createToken(
    { id: employee.id, role: employee.role },
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
};
