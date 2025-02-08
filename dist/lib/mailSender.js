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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSender = void 0;
const variables_1 = __importDefault(require("../config/variables"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailTemplate_1 = require("./mailTemplate");
let mailTransporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: variables_1.default.sender_email,
        pass: variables_1.default.sender_password,
    },
});
// invitation
const invitationRequest = (email, designation, invite_token, joining_date) => __awaiter(void 0, void 0, void 0, function* () {
    let mailDetails = {
        from: variables_1.default.sender_email,
        to: email,
        subject: "Invitation from Themefisher",
        html: yield (0, mailTemplate_1.invitationTemplate)(designation, joining_date, invite_token),
    };
    yield mailTransporter.sendMail(mailDetails);
});
// offboarding
const offboardingInitiate = (email, name, resignation_date) => __awaiter(void 0, void 0, void 0, function* () {
    let mailDetails = {
        from: variables_1.default.sender_email,
        to: email,
        subject: "Invitation from Themefisher",
        html: yield (0, mailTemplate_1.offboardingTemplate)(name, resignation_date),
    };
    yield mailTransporter.sendMail(mailDetails);
});
// leave request
const leaveRequest = (emails, name, leaveType, dayCount, startDate, endDate, reason) => __awaiter(void 0, void 0, void 0, function* () {
    let mailDetails = {
        from: variables_1.default.sender_email,
        to: emails,
        subject: `Leave Request by ${name}`,
        html: yield (0, mailTemplate_1.leaveRequestTemplate)(name, leaveType, dayCount, startDate, endDate, reason),
    };
    yield mailTransporter.sendMail(mailDetails);
});
// leave request response
const leaveRequestResponse = (email, name, leaveType, dayCount, startDate, endDate, reason, status) => __awaiter(void 0, void 0, void 0, function* () {
    let mailDetails = {
        from: variables_1.default.sender_email,
        to: email,
        subject: `Leave Request ${status}`,
        html: status === "approved"
            ? yield (0, mailTemplate_1.leaveRequestApprovedTemplate)(name, leaveType, dayCount, startDate, endDate, reason)
            : yield (0, mailTemplate_1.leaveRequestRejectedTemplate)(name, leaveType, dayCount, startDate, endDate, reason),
    };
    yield mailTransporter.sendMail(mailDetails);
});
// salary sheet
const salarySheet = (email, name, date, gross_salary, bonus_type, bonus_amount) => __awaiter(void 0, void 0, void 0, function* () {
    let mailDetails = {
        from: variables_1.default.sender_email,
        to: email,
        subject: `Payslip for the month of ${new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(date))} ${new Date(date).getFullYear()}`,
        html: yield (0, mailTemplate_1.salarySheetTemplate)(name, date, gross_salary, bonus_type, bonus_amount),
    };
    yield mailTransporter.sendMail(mailDetails);
});
exports.mailSender = {
    invitationRequest,
    offboardingInitiate,
    leaveRequest,
    leaveRequestResponse,
    salarySheet,
};
//# sourceMappingURL=mailSender.js.map