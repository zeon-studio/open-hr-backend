import config from "@/config/variables";
import nodemailer from "nodemailer";
import {
  leaveRequestApprovedTemplate,
  leaveRequestRejectedTemplate,
  leaveRequestTemplate,
  otpSenderTemplate,
} from "./mailTemplate";

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.sender_email,
    pass: config.sender_password,
  },
});

// send OTP
const otpSender = async (email: string, otp: string) => {
  let mailDetails = {
    from: config.sender_email,
    to: email,
    subject: "Themefisher Account Verification",
    html: otpSenderTemplate(otp),
  };
  await mailTransporter.sendMail(mailDetails);
};

// leave request
const leaveRequest = async (
  email: string,
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: string,
  endDate: string,
  reason: string
) => {
  let mailDetails = {
    from: config.sender_email,
    to: email,
    subject: `Leave Request by ${name}`,
    html: leaveRequestTemplate(
      name,
      leaveType,
      dayCount,
      startDate,
      endDate,
      reason
    ),
  };
  await mailTransporter.sendMail(mailDetails);
};

// leave request response
const leaveRequestResponse = async (
  email: string,
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: string,
  endDate: string,
  reason: string,
  status: string
) => {
  let mailDetails = {
    from: config.sender_email,
    to: email,
    subject: `Leave Request ${status}`,
    html:
      status === "approved"
        ? leaveRequestApprovedTemplate(
            name,
            leaveType,
            dayCount,
            startDate,
            endDate,
            reason
          )
        : leaveRequestRejectedTemplate(
            name,
            leaveType,
            dayCount,
            startDate,
            endDate,
            reason
          ),
  };
  await mailTransporter.sendMail(mailDetails);
};

export const mailSender = {
  otpSender,
  leaveRequest,
  leaveRequestResponse,
};
