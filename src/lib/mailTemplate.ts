import { Setting } from "../modules/setting/setting.model";
import { formatDate } from "./dateConverter";

// otp sender template
export function otpSenderTemplate(otp: string): string {
  return `<div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #007bff;">OTP Verification</h1>
    <br>
    <br>
    <br>
    <p>Use this OTP to verify your account</p>
    <div style="border: 1px solid #ccc; padding: 4px 20px; border-radius: 5px; display: inline-block;">
    <h2>${otp}</h2>
    </div>
    <br>
    <br>
    <br>
    <p>If you encounter any issues or have questions, please contact your administrator.</p>
    </div>
    `;
}

// invitation template
export async function invitationTemplate(
  designation: string,
  joining_date: Date,
  invite_token: string
): Promise<string> {
  const settings = await Setting.findOne().exec();
  if (!settings) {
    throw new Error("Settings not found");
  }
  return `<div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #007bff;">Welcome to ${settings.company_name}!</h1>
    <br>
    <br>
    <br>
    <p>We are excited to welcome you to our team as a ${designation}! Your contributions will be invaluable to our success.</p>
    <p>Your joining date is ${formatDate(
      joining_date
    )}. You can start using your account from now.</p>
    <br>
    <br>
    <br>
    
    <a href="${settings.app_url}/onboard?token=${invite_token}" style="color: #007bff;">Click here</a> to join the team.
    </div>
    `;
}

// offboarding template
export async function offboardingTemplate(
  name: string,
  resignation_date: Date
): Promise<string> {
  const settings = await Setting.findOne().exec();
  if (!settings) {
    throw new Error("Settings not found");
  }

  return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>Dear ${name},</p>

    <p>As you transition out of ${settings.company_name}, effective ${formatDate(resignation_date)}, we kindly request your cooperation to ensure the offboarding process is completed smoothly. Please assist by completing the following steps:</p>

    <ol>
      <li>Provide all necessary notes, files, and updates on the tasks you were responsible for, and share the final updates directly with your team lead.</li>
      <li>Share your work email credentials so we can manage the transition properly.</li>
      <li>Return all company devices, equipment, and your employee ID to the Admin team.</li>
      <li>Complete the remaining exit formalities with the HR department.</li>
    </ol>

    <p>Thank you for your contributions during your time here. We wish you the very best in your next steps.</p>

    <p>Regards,<br>HR Department, ${settings.company_name}</p>
  </div>
  `;
}

// leave request template
export async function leaveRequestTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string
): Promise<string> {
  const settings = await Setting.findOne().exec();
  if (!settings) {
    throw new Error("Settings not found");
  }
  return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>${name} has submitted a request for leave. Below are the details:</p>

    <ul style="list-style-type: none; padding: 0;">
      <li style="text-transform: capitalize; margin-bottom: 5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom: 5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${formatDate(startDate)}` : `${dayCount} days starts from ${formatDate(startDate)} to ${formatDate(endDate)}`}</li>
      <li style="margin-bottom: 5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>

    <p>To accept or reject the request please visit <a href="${settings.app_url}/leave-requests" style="color: #007bff;">${settings.app_name}</a></p>
  </div>
  `;
}

// leave request discord template
export function leaveRequestDiscordTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string
): string {
  return `**${name}** has requested **${leaveType}** leave for **${dayCount}** ${dayCount === 1 ? `**day** on **${startDate}**` : `**days** starts from **${startDate}** to **${endDate}**`} with the reason: **${reason}**`;
}

// leave Request Approved Template
export function leaveRequestApprovedTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string
): string {
  return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>Dear ${name},</p>

    <p>I hope this message finds you well. Your request for leave has been reviewed and approved. Below are the details:</p>

    <ul style="list-style-type: none; padding: 0;">
      <li style="margin-bottom: 5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom: 5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${formatDate(startDate)}` : `${dayCount} days starts from ${formatDate(startDate)} to ${formatDate(endDate)}`}</li>
      <li style="margin-bottom: 5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>

    <p>Please ensure all necessary handovers and preparations are made before your leave period begins.</p>

    <p>Thank you for following the proper procedures for your leave request. We hope you have a restful time off.</p>

    <p>Best Regards,<br>Admin Team</p>
  </div>
  `;
}

// leave Request Rejected Template
export function leaveRequestRejectedTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string
): string {
  return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p>Dear ${name},</p>
            
    <p>I regret to inform you that your request for leave has been reviewed but cannot be approved at this time. Below are the details of your request:</p>

    <ul style="list-style-type: none; padding: 0;">
      <li style="margin-bottom: 5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom: 5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${formatDate(startDate)}` : `${dayCount} days starts from ${formatDate(startDate)} to ${formatDate(endDate)}`}</li>
      <li style="margin-bottom: 5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>

    <p>We understand the importance of time off, but due to current circumstances, your request cannot be accommodated. Please reach out if you need further clarification or assistance.</p>

    <p>We appreciate your understanding and encourage you to discuss any alternative options with your supervisor.</p>

    <p>Best Regards,<br>Admin Team</p>
  </div>
  `;
}

// salary sheet template
export async function salarySheetTemplate(
  name: string,
  date: Date,
  gross_salary: number,
  bonus_type: string,
  bonus_amount: number
): Promise<string> {
  const settings = await Setting.findOne().exec();

  if (!settings) {
    throw new Error("Settings not found");
  }

  // basic salary
  const basicAllotment = Number(settings.payroll.basic.replace("%", ""));
  const basicSalary = gross_salary * (basicAllotment / 100);

  const houseRentAllotment = Number(
    settings.payroll.house_rent.replace("%", "")
  );
  const houseRent = basicSalary * (houseRentAllotment / 100);

  const medicalAllotment = Number(settings.payroll.medical.replace("%", ""));
  const medical = basicSalary * (medicalAllotment / 100);

  const conveyanceAllotment = Number(
    settings.payroll.conveyance.replace("%", "")
  );
  const conveyance = basicSalary * (conveyanceAllotment / 100);

  return `
  <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
    <!-- Logo -->
    <div style="margin-bottom: 30px;">
      <img src="${settings.logo_url}" alt="${settings.company_name}" style="width: ${settings.logo_width}px; height: ${settings.logo_height}px;">
    </div>

    <!-- Date -->
    <div style="margin-bottom: 20px;">
      <p style="margin: 0;">Date: ${formatDate(date)}</p>
    </div>

    <!-- Employee Details -->
    <div style="margin-bottom: 20px;">
      <p style="margin: 0;">To</p>
      <p style="margin: 5px 0; font-weight: bold;">${name}</p>
      <p style="margin: 0;">${settings.company_name}</p>
    </div>

    <!-- Title -->
    <div style="margin-bottom: 20px; text-align: center;">
      <h2 style="margin: 0;">Payslip for the month of ${new Date(date).toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
    </div>

    <!-- Message -->
    <div style="margin-bottom: 20px;">
      <p>Dear ${name}, your salary for the month of ${new Date(date).toLocaleString("en-US", { month: "long", year: "numeric" })} has been deposited to your Account as per the below breakdown.</p>
    </div>

    <!-- Salary Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f8f8f8;">Particulars</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right; background-color: #f8f8f8;">Amount (BDT)</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Basic Salary</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${basicSalary}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">House Rent Allowance (${houseRentAllotment}% of Basic)</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${houseRent}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Medical Allowance (${medicalAllotment}% of Basic)</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${medical}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Conveyance Allowance (${conveyanceAllotment}% of Basic)</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${conveyance}</td>
      </tr>
      ${
        bonus_amount
          ? `<tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${bonus_type} Bonus</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${bonus_amount}</td>
      </tr>`
          : ""
      }
      <tr style="font-weight: bold;">
        <td style="border: 1px solid #ddd; padding: 8px;">Total</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${gross_salary + (bonus_amount || 0)}</td>
      </tr>
    </table>

    <!-- Tax Note -->
    <div style="margin-bottom: 30px;">
      <p>No tax was deducted at source from your salary.</p>
    </div>

    <!-- Signature -->
    <div style="margin-top: 40px;">
      <p style="margin: 0;">Regards,<br>Finance Team, ${settings.company_name}</p>
    </div>
  </div>
`;
}
