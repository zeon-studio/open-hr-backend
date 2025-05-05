"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EEmployeeStatus = exports.ERole = exports.EBloodGroup = exports.EMaritalStatus = exports.EGender = exports.EDepartment = void 0;
var EDepartment;
(function (EDepartment) {
    EDepartment["DEVELOPMENT"] = "development";
    EDepartment["DESIGN"] = "design";
    EDepartment["MARKETING"] = "marketing";
    EDepartment["ADMIN"] = "admin";
    EDepartment["PRODUCTION"] = "production";
    EDepartment["HR_FINANCE"] = "hr_finance";
    EDepartment["OTHER"] = "other";
})(EDepartment || (exports.EDepartment = EDepartment = {}));
var EGender;
(function (EGender) {
    EGender["MALE"] = "male";
    EGender["FEMALE"] = "female";
})(EGender || (exports.EGender = EGender = {}));
var EMaritalStatus;
(function (EMaritalStatus) {
    EMaritalStatus["MARRIED"] = "married";
    EMaritalStatus["UNMARRIED"] = "unmarried";
    EMaritalStatus["DIVORCED"] = "divorced";
    EMaritalStatus["WIDOWED"] = "widowed";
})(EMaritalStatus || (exports.EMaritalStatus = EMaritalStatus = {}));
var EBloodGroup;
(function (EBloodGroup) {
    EBloodGroup["O_POSITIVE"] = "o+";
    EBloodGroup["O_NEGATIVE"] = "o-";
    EBloodGroup["A_POSITIVE"] = "a+";
    EBloodGroup["A_NEGATIVE"] = "a-";
    EBloodGroup["B_POSITIVE"] = "b+";
    EBloodGroup["B_NEGATIVE"] = "b-";
    EBloodGroup["AB_POSITIVE"] = "ab+";
    EBloodGroup["AB_NEGATIVE"] = "ab-";
})(EBloodGroup || (exports.EBloodGroup = EBloodGroup = {}));
var ERole;
(function (ERole) {
    ERole["USER"] = "user";
    ERole["MODERATOR"] = "moderator";
    ERole["ADMIN"] = "admin";
    ERole["FORMER"] = "former";
})(ERole || (exports.ERole = ERole = {}));
var EEmployeeStatus;
(function (EEmployeeStatus) {
    EEmployeeStatus["PENDING"] = "pending";
    EEmployeeStatus["ACTIVE"] = "active";
    EEmployeeStatus["ARCHIVED"] = "archived";
})(EEmployeeStatus || (exports.EEmployeeStatus = EEmployeeStatus = {}));
//# sourceMappingURL=employee.type.js.map