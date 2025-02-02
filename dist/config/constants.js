"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOffboardingTasks = exports.defaultOnboardingTasks = exports.leaveAllottedDays = exports.paginationField = void 0;
exports.paginationField = ["limit", "page", "sortBy", "sortOrder"];
exports.leaveAllottedDays = {
    casual: 10,
    sick: 5,
    earned: 12,
    without_pay: 30,
};
exports.defaultOnboardingTasks = [
    {
        task_name: "Add Fingerprint",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Provide ID Card",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Provide Appointment Letter",
        assigned_to: "TFADM2021002",
        status: "pending",
    },
    {
        task_name: "Provide Employment Contract",
        assigned_to: "TFADM2021002",
        status: "pending",
    },
    {
        task_name: "Provide Welcome Kit",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Provide Devices",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Provide Office Intro",
        assigned_to: "TFADM2021002",
        status: "pending",
    },
];
exports.defaultOffboardingTasks = [
    {
        task_name: "Remove Fingerprint",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Handover Tasks",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Collect ID Card",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Collect Email Credentials",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Collect Devices",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
    {
        task_name: "Provide NDA",
        assigned_to: "TFADM2021002",
        status: "pending",
    },
    {
        task_name: "Provide Certificate",
        assigned_to: "TFADM2021002",
        status: "pending",
    },
    {
        task_name: "Farewell",
        assigned_to: "TFADM2024003",
        status: "pending",
    },
];
//# sourceMappingURL=constants.js.map