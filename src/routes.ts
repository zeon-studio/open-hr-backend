import express from "express";
import assetRouter from "./modules/asset/asset.routes";
import authenticationRouter from "./modules/authentication/authentication.route";
import calendarRouter from "./modules/calendar/calendar.routes";
import bucketRouter from "./modules/common/bucket.route";
import courseRouter from "./modules/course/course.routes";
import employeeAchievementRouter from "./modules/employee-achievement/employee-achievement.route";
import employeeBankRouter from "./modules/employee-bank/employee-bank.route";
import employeeContactRouter from "./modules/employee-contact/employee-contact.route";
import employeeDocumentRouter from "./modules/employee-document/employee-document.route";
import employeeEducationRouter from "./modules/employee-education/employee-education.route";
import employeeJobRouter from "./modules/employee-job/employee-job.route";
import employeeOffboardingRouter from "./modules/employee-offboarding/employee-offboarding.route";
import employeeOnboardingRouter from "./modules/employee-onboarding/employee-onboarding.route";
import employeeRouter from "./modules/employee/employee.route";
import leaveRequestRouter from "./modules/leave-request/leave-request.routes";
import leaveRouter from "./modules/leave/leave.routes";
import payrollRouter from "./modules/payroll/payroll.route";
import settingRouter from "./modules/setting/setting.routes";
import toolRouter from "./modules/tool/tool.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/employee",
    route: employeeRouter,
  },
  {
    path: "/employee-achievement",
    route: employeeAchievementRouter,
  },
  {
    path: "/employee-bank",
    route: employeeBankRouter,
  },
  {
    path: "/employee-contact",
    route: employeeContactRouter,
  },
  {
    path: "/employee-document",
    route: employeeDocumentRouter,
  },
  {
    path: "/employee-education",
    route: employeeEducationRouter,
  },
  {
    path: "/employee-job",
    route: employeeJobRouter,
  },
  {
    path: "/employee-offboarding",
    route: employeeOffboardingRouter,
  },
  {
    path: "/employee-onboarding",
    route: employeeOnboardingRouter,
  },
  {
    path: "/leave",
    route: leaveRouter,
  },
  {
    path: "/payroll",
    route: payrollRouter,
  },
  {
    path: "/leave-request",
    route: leaveRequestRouter,
  },
  {
    path: "/tool",
    route: toolRouter,
  },
  {
    path: "/asset",
    route: assetRouter,
  },
  {
    path: "/calendar",
    route: calendarRouter,
  },
  {
    path: "/course",
    route: courseRouter,
  },
  {
    path: "/bucket",
    route: bucketRouter,
  },
  {
    path: "/authentication",
    route: authenticationRouter,
  },
  {
    path: "/setting",
    route: settingRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
