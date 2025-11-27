import config from "@/config/variables";
import { Setting } from "@/modules/setting/setting.model";
import nodemailer from "nodemailer";
import {
  invitationTemplate,
  leaveRequestApprovedTemplate,
  leaveRequestRejectedTemplate,
  leaveRequestTemplate,
  offboardingTemplate,
  otpSenderTemplate,
  salarySheetTemplate,
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
    subject: "Verification Code For HR Management System",
    html: otpSenderTemplate(otp),
  };
  await mailTransporter.sendMail(mailDetails);
};

// invitation
const invitationRequest = async (
  email: string,
  designation: string,
  invite_token: string,
  joining_date: Date
) => {
  const settings = await Setting.findOne().exec();
  if (!settings) {
    throw new Error("Settings not found");
  }
  let mailDetails = {
    from: config.sender_email,
    to: email,
    subject: `Invitation to join ${settings.company_name}`,
    html: await invitationTemplate(designation, joining_date, invite_token),
  };
  await mailTransporter.sendMail(mailDetails);
};

// offboarding
const offboardingInitiate = async (
  email: string,
  name: string,
  resignation_date: Date
) => {
  const settings = await Setting.findOne().exec();
  if (!settings) {
    throw new Error("Settings not found");
  }
  let mailDetails = {
    from: config.sender_email,
    to: email,
    subject: `Offboarding Initiated from ${settings.company_name}`,
    html: await offboardingTemplate(name, resignation_date),
  };
  await mailTransporter.sendMail(mailDetails);
};

// leave request
const leaveRequest = async (
  emails: string[],
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string
) => {
  let mailDetails = {
    from: config.sender_email,
    to: emails,
    subject: `Leave Request by ${name}`,
    html: await leaveRequestTemplate(
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
  startDate: Date,
  endDate: Date,
  reason: string,
  status: string
) => {
  let mailDetails = {
    from: config.sender_email,
    to: email,
    subject: `Leave Request ${status}`,
    html:
      status === "approved"
        ? await leaveRequestApprovedTemplate(
            name,
            leaveType,
            dayCount,
            startDate,
            endDate,
            reason
          )
        : await leaveRequestRejectedTemplate(
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

// salary sheet
const salarySheet = async (
  email: string,
  name: string,
  date: Date,
  gross_salary: number,
  bonus_type: string,
  bonus_amount: number
) => {
  let mailDetails = {
    from: config.sender_email,
    to: email,
    subject: `Payslip for the month of ${new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(date))} ${new Date(date).getFullYear()}`,
    html: await salarySheetTemplate(
      name,
      date,
      gross_salary,
      bonus_type,
      bonus_amount
    ),
  };
  await mailTransporter.sendMail(mailDetails);
};

export const mailSender = {
  otpSender,
  invitationRequest,
  offboardingInitiate,
  leaveRequest,
  leaveRequestResponse,
  salarySheet,
};
