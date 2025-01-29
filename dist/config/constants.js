"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offboardingTasks = exports.onboardingTasks = exports.leaveAllottedDays = exports.conditionalWeekendDays = exports.weekendDays = exports.paginationField = void 0;
exports.paginationField = ["limit", "page", "sortBy", "sortOrder"];
exports.weekendDays = ["Friday"];
exports.conditionalWeekendDays = {
    Saturday: [1, 3], // Array of week numbers
};
exports.leaveAllottedDays = {
    casual: 10,
    sick: 5,
    earned: 12,
    without_pay: 30,
};
exports.onboardingTasks = {
    add_fingerprint: "TFADM2024003",
    provide_id_card: "TFADM2024003",
    provide_appointment_letter: "TFADM2021002",
    provide_employment_contract: "TFADM2021002",
    provide_welcome_kit: "TFADM2024003",
    provide_devices: "TFADM2024003",
    provide_office_intro: "TFADM2021002",
};
exports.offboardingTasks = {
    remove_fingerprint: "TFADM2024003",
    task_handover: "TFADM2024003",
    collect_id_card: "TFADM2024003",
    collect_email: "TFADM2024003",
    collect_devices: "TFADM2024003",
    nda_agreement: "TFADM2021002",
    provide_certificate: "TFADM2021002",
    farewell: "TFADM2024003",
};
//# sourceMappingURL=constants.js.map