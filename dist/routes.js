"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asset_routes_1 = __importDefault(require("./modules/asset/asset.routes"));
const authentication_route_1 = __importDefault(require("./modules/authentication/authentication.route"));
const calendar_routes_1 = __importDefault(require("./modules/calendar/calendar.routes"));
const bucket_route_1 = __importDefault(require("./modules/common/bucket.route"));
const course_routes_1 = __importDefault(require("./modules/course/course.routes"));
const employee_achievement_route_1 = __importDefault(require("./modules/employee-achievement/employee-achievement.route"));
const employee_bank_route_1 = __importDefault(require("./modules/employee-bank/employee-bank.route"));
const employee_contact_route_1 = __importDefault(require("./modules/employee-contact/employee-contact.route"));
const employee_document_route_1 = __importDefault(require("./modules/employee-document/employee-document.route"));
const employee_education_route_1 = __importDefault(require("./modules/employee-education/employee-education.route"));
const employee_job_route_1 = __importDefault(require("./modules/employee-job/employee-job.route"));
const employee_offboarding_route_1 = __importDefault(require("./modules/employee-offboarding/employee-offboarding.route"));
const employee_onboarding_route_1 = __importDefault(require("./modules/employee-onboarding/employee-onboarding.route"));
const employee_route_1 = __importDefault(require("./modules/employee/employee.route"));
const leave_request_routes_1 = __importDefault(require("./modules/leave-request/leave-request.routes"));
const leave_routes_1 = __importDefault(require("./modules/leave/leave.routes"));
const payroll_route_1 = __importDefault(require("./modules/payroll/payroll.route"));
const setting_routes_1 = __importDefault(require("./modules/setting/setting.routes"));
const tool_routes_1 = __importDefault(require("./modules/tool/tool.routes"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/employee",
        route: employee_route_1.default,
    },
    {
        path: "/employee-achievement",
        route: employee_achievement_route_1.default,
    },
    {
        path: "/employee-bank",
        route: employee_bank_route_1.default,
    },
    {
        path: "/employee-contact",
        route: employee_contact_route_1.default,
    },
    {
        path: "/employee-document",
        route: employee_document_route_1.default,
    },
    {
        path: "/employee-education",
        route: employee_education_route_1.default,
    },
    {
        path: "/employee-job",
        route: employee_job_route_1.default,
    },
    {
        path: "/employee-offboarding",
        route: employee_offboarding_route_1.default,
    },
    {
        path: "/employee-onboarding",
        route: employee_onboarding_route_1.default,
    },
    {
        path: "/leave",
        route: leave_routes_1.default,
    },
    {
        path: "/payroll",
        route: payroll_route_1.default,
    },
    {
        path: "/leave-request",
        route: leave_request_routes_1.default,
    },
    {
        path: "/tool",
        route: tool_routes_1.default,
    },
    {
        path: "/asset",
        route: asset_routes_1.default,
    },
    {
        path: "/calendar",
        route: calendar_routes_1.default,
    },
    {
        path: "/course",
        route: course_routes_1.default,
    },
    {
        path: "/bucket",
        route: bucket_route_1.default,
    },
    {
        path: "/authentication",
        route: authentication_route_1.default,
    },
    {
        path: "/setting",
        route: setting_routes_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=routes.js.map