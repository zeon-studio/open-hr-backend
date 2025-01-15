import { dateFormat } from "@/lib/dateFormat";

// otp sender template
export function otpSenderTemplate(otp: string): string {
  return `<div style="text-align: center;">
    <h1>Thank you for choosing Themefisher!</h1>
    <br>
    <br>
    <br>
    <h2>Use this OTP to verify your account</h2>
    <div style="border: 1px solid #ccc; padding: 4px 20px; border-radius: 5px; display: inline-block;">
    <h2>${otp}</h2>
    </div>
    <br>
    <br>
    <br>
    If you encounter any issues or have questions, please contact our support <a href="https://themefisher.com/contact" style="color: #007bff;">here</a>`;
}

// leave request template
export function leaveRequestTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: string,
  endDate: string,
  reason: string
): string {
  return `
  <p>${name} has submitted a request for leave. Below are the details:</p>

  <ul>
    <li style="text-transform: capitalize;">Type of Leave: ${leaveType}</li>
    <li>Number of ${dayCount === 1 ? "Day" : "Days"}: ${dayCount === 1 ? `${dayCount} day on ${dateFormat(startDate)}` : `${dayCount} days starts from ${dateFormat(startDate)} to ${dateFormat(endDate)}`}</li>
    <li>Reason: ${reason}</li>
  </ul>

  <p>To accept or reject the request please visit <a href="https://erp.teamosis.com/request">Teamosis ERP</a></p>
  `;
}

// leave Request Approved Template
export function leaveRequestApprovedTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: string,
  endDate: string,
  reason: string
): string {
  return `
  <p>Dear ${name},</p>

  <p>I hope this message finds you well. Your request for leave has been reviewed and approved. Below are the details:</p>

  <ul>
    <li>Type of Leave: ${leaveType}</li>
    <li>Number of ${dayCount === 1 ? "Day" : "Days"}: ${dayCount === 1 ? `${dayCount} day on ${dateFormat(startDate)}` : `${dayCount} days starts from ${dateFormat(startDate)} to ${dateFormat(endDate)}`}</li>
    <li>Reason: ${reason}</li>
  </ul>

  <p>Please ensure all necessary handovers and preparations are made before your leave period begins.</p>

  <p>Thank you for following the proper procedures for your leave request. We hope you have a restful time off.</p>

  <p>Best Regards,<br>Admin Team</p>
`;
}

// leave Request Rejected Template
export function leaveRequestRejectedTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: string,
  endDate: string,
  reason: string
): string {
  return `
  <p>Dear ${name},</p>
          
  <p>I regret to inform you that your request for leave has been reviewed but cannot be approved at this time. Below are the details of your request:</p>

  <ul>
    <li>Type of Leave: ${leaveType}</li>
    <li>Number of ${dayCount === 1 ? "Day" : "Days"}: ${dayCount === 1 ? `${dayCount} day on ${dateFormat(startDate)}` : `${dayCount} days starts from ${dateFormat(startDate)} to ${dateFormat(endDate)}`}</li>
    <li>Reason: ${reason}</li>
  </ul>

  <p>We understand the importance of time off, but due to current circumstances, your request cannot be accommodated. Please reach out if you need further clarification or assistance.</p>

  <p>We appreciate your understanding and encourage you to discuss any alternative options with your supervisor.</p>

  <p>Best Regards,<br>Admin Team</p>
  `;
}
