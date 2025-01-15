import config from "@/config/variables";
import nodemailer from "nodemailer";
import {
  invitationTemplate,
  leaveRequestApprovedTemplate,
  leaveRequestRejectedTemplate,
  leaveRequestTemplate,
} from "./mailTemplate";

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.sender_email,
    pass: config.sender_password,
  },
});

// invitation
const invitationRequest = async (
  email: string,
  designation: string,
  joining_date: Date
) => {
  let mailDetails = {
    from: config.sender_email,
    to: email,
    subject: "Invitation from Themefisher",
    html: invitationTemplate(designation, joining_date),
  };
  await mailTransporter.sendMail(mailDetails);
};

// leave request
const leaveRequest = async (
  email: string,
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
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
  invitationRequest,
  leaveRequest,
  leaveRequestResponse,
};
