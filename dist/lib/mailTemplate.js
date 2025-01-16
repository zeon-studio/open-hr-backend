"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationTemplate = invitationTemplate;
exports.leaveRequestTemplate = leaveRequestTemplate;
exports.leaveRequestDiscordTemplate = leaveRequestDiscordTemplate;
exports.leaveRequestApprovedTemplate = leaveRequestApprovedTemplate;
exports.leaveRequestRejectedTemplate = leaveRequestRejectedTemplate;
// invitation template
function invitationTemplate(designation, joining_date) {
    return `<div style="text-align: center;">
    <h1>Welcome to Themefisher!</h1>
    <br>
    <br>
    <br>
    <p>We are excited to welcome you to our team as a ${designation}! Your contributions will be invaluable to our success.</p>
    <p>Your joining date is ${joining_date}. You can start using your account from now.</p>
    <br>
    <br>
    <br>
    
    <a href="https://erp.teamosis.com" style="color: #007bff;">Click here</a> to join the team.
    </div>
    `;
}
// leave request template
function leaveRequestTemplate(name, leaveType, dayCount, startDate, endDate, reason) {
    return `
  <p>${name} has submitted a request for leave. Below are the details:</p>

  <ul>
    <li style="text-transform: capitalize;">Type of Leave: ${leaveType}</li>
    <li>Number of ${dayCount === 1 ? "Day" : "Days"}: ${dayCount === 1 ? `${dayCount} day on ${startDate}` : `${dayCount} days starts from ${startDate} to ${endDate}`}</li>
    <li>Reason: ${reason}</li>
  </ul>

  <p>To accept or reject the request please visit <a href="https://erp.teamosis.com/request">Teamosis ERP</a></p>
  `;
}
// leave request discord template
function leaveRequestDiscordTemplate(name, leaveType, dayCount, startDate, endDate, reason) {
    return `**${name}** has requested **${leaveType}** leave for **${dayCount}** ${dayCount === 1 ? `**day** on **${startDate}**` : `**days** starts from **${startDate}** to **${endDate}**`} with the reason: **${reason}**`;
}
// leave Request Approved Template
function leaveRequestApprovedTemplate(name, leaveType, dayCount, startDate, endDate, reason) {
    return `
  <p>Dear ${name},</p>

  <p>I hope this message finds you well. Your request for leave has been reviewed and approved. Below are the details:</p>

  <ul>
    <li>Type of Leave: ${leaveType}</li>
    <li>Number of ${dayCount === 1 ? "Day" : "Days"}: ${dayCount === 1 ? `${dayCount} day on ${startDate}` : `${dayCount} days starts from ${startDate} to ${endDate}`}</li>
    <li>Reason: ${reason}</li>
  </ul>

  <p>Please ensure all necessary handovers and preparations are made before your leave period begins.</p>

  <p>Thank you for following the proper procedures for your leave request. We hope you have a restful time off.</p>

  <p>Best Regards,<br>Admin Team</p>
`;
}
// leave Request Rejected Template
function leaveRequestRejectedTemplate(name, leaveType, dayCount, startDate, endDate, reason) {
    return `
  <p>Dear ${name},</p>
          
  <p>I regret to inform you that your request for leave has been reviewed but cannot be approved at this time. Below are the details of your request:</p>

  <ul>
    <li>Type of Leave: ${leaveType}</li>
    <li>Number of ${dayCount === 1 ? "Day" : "Days"}: ${dayCount === 1 ? `${dayCount} day on ${startDate}` : `${dayCount} days starts from ${startDate} to ${endDate}`}</li>
    <li>Reason: ${reason}</li>
  </ul>

  <p>We understand the importance of time off, but due to current circumstances, your request cannot be accommodated. Please reach out if you need further clarification or assistance.</p>

  <p>We appreciate your understanding and encourage you to discuss any alternative options with your supervisor.</p>

  <p>Best Regards,<br>Admin Team</p>
  `;
}
//# sourceMappingURL=mailTemplate.js.map