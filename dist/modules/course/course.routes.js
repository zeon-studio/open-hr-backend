"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = require("../../enums/roles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checkToken_1 = require("../../middlewares/checkToken");
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const courseRouter = express_1.default.Router();
// get all data
courseRouter.get("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), course_controller_1.courseController.getAllCourseController);
// get course by user
courseRouter.get("/user/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), course_controller_1.courseController.getCoursesByUserController);
// get single data
courseRouter.get("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), course_controller_1.courseController.getCourseController);
// create data
courseRouter.post("/", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), course_controller_1.courseController.createCourseController);
// update data
courseRouter.patch("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR), course_controller_1.courseController.updateCourseController);
// delete data
courseRouter.delete("/:id", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN), course_controller_1.courseController.deleteCourseController);
exports.default = courseRouter;
//# sourceMappingURL=course.routes.js.map