"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationTemplate = invitationTemplate;
exports.offboardingTemplate = offboardingTemplate;
exports.leaveRequestTemplate = leaveRequestTemplate;
exports.leaveRequestDiscordTemplate = leaveRequestDiscordTemplate;
exports.leaveRequestApprovedTemplate = leaveRequestApprovedTemplate;
exports.leaveRequestRejectedTemplate = leaveRequestRejectedTemplate;
const setting_model_1 = require("../modules/setting/setting.model");
const dateConverter_1 = require("./dateConverter");
// invitation template
function invitationTemplate(designation, joining_date, invite_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield setting_model_1.Setting.findOne().exec();
        if (!settings) {
            throw new Error("Settings not found");
        }
        return `<div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #007bff;">Welcome to ${settings.company_name}!</h1>
    <br>
    <br>
    <br>
    <p>We are excited to welcome you to our team as a ${designation}! Your contributions will be invaluable to our success.</p>
    <p>Your joining date is ${(0, dateConverter_1.formatDate)(joining_date)}. You can start using your account from now.</p>
    <br>
    <br>
    <br>
    
    <a href="${settings.company_website}/onboard?token=${invite_token}" style="color: #007bff;">Click here</a> to join the team.
    </div>
    `;
    });
}
// offboarding template
function offboardingTemplate(name, resignation_date) {
    return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>Dear ${name},</p>

    <p>We regret to inform you that your employment has been terminated effective ${(0, dateConverter_1.formatDate)(resignation_date)}.</p>

    <p>We appreciate your contributions to the company and wish you all the best in your future endeavors.</p>

    <p>Best Regards,<br>Admin Team</p>
  </div>
  `;
}
// leave request template
function leaveRequestTemplate(name, leaveType, dayCount, startDate, endDate, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield setting_model_1.Setting.findOne().exec();
        if (!settings) {
            throw new Error("Settings not found");
        }
        return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>${name} has submitted a request for leave. Below are the details:</p>

    <ul style="list-style-type: none; padding: 0;">
      <li style="text-transform: capitalize; margin-bottom: 5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom: 5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${(0, dateConverter_1.formatDate)(startDate)}` : `${dayCount} days starts from ${(0, dateConverter_1.formatDate)(startDate)} to ${(0, dateConverter_1.formatDate)(endDate)}`}</li>
      <li style="margin-bottom: 5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>

    <p>To accept or reject the request please visit <a href="${settings.company_website}/request" style="color: #007bff;">${settings.company_name} ERP</a></p>
  </div>
  `;
    });
}
// leave request discord template
function leaveRequestDiscordTemplate(name, leaveType, dayCount, startDate, endDate, reason) {
    return `**${name}** has requested **${leaveType}** leave for **${dayCount}** ${dayCount === 1 ? `**day** on **${startDate}**` : `**days** starts from **${startDate}** to **${endDate}**`} with the reason: **${reason}**`;
}
// leave Request Approved Template
function leaveRequestApprovedTemplate(name, leaveType, dayCount, startDate, endDate, reason) {
    return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>Dear ${name},</p>

    <p>I hope this message finds you well. Your request for leave has been reviewed and approved. Below are the details:</p>

    <ul style="list-style-type: none; padding: 0;">
      <li style="margin-bottom: 5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom: 5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${(0, dateConverter_1.formatDate)(startDate)}` : `${dayCount} days starts from ${(0, dateConverter_1.formatDate)(startDate)} to ${(0, dateConverter_1.formatDate)(endDate)}`}</li>
      <li style="margin-bottom: 5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>

    <p>Please ensure all necessary handovers and preparations are made before your leave period begins.</p>

    <p>Thank you for following the proper procedures for your leave request. We hope you have a restful time off.</p>

    <p>Best Regards,<br>Admin Team</p>
  </div>
  `;
}
// leave Request Rejected Template
function leaveRequestRejectedTemplate(name, leaveType, dayCount, startDate, endDate, reason) {
    return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>Dear ${name},</p>
            
    <p>I regret to inform you that your request for leave has been reviewed but cannot be approved at this time. Below are the details of your request:</p>

    <ul style="list-style-type: none; padding: 0;">
      <li style="margin-bottom: 5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom: 5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${(0, dateConverter_1.formatDate)(startDate)}` : `${dayCount} days starts from ${(0, dateConverter_1.formatDate)(startDate)} to ${(0, dateConverter_1.formatDate)(endDate)}`}</li>
      <li style="margin-bottom: 5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>

    <p>We understand the importance of time off, but due to current circumstances, your request cannot be accommodated. Please reach out if you need further clarification or assistance.</p>

    <p>We appreciate your understanding and encourage you to discuss any alternative options with your supervisor.</p>

    <p>Best Regards,<br>Admin Team</p>
  </div>
  `;
}
//# sourceMappingURL=mailTemplate.js.map