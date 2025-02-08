"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EEmployeeStatus = exports.ERole = exports.EBloodGroup = exports.EMaritalStatus = exports.EGender = void 0;
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
    EBloodGroup["O_POSITIVE"] = "O+";
    EBloodGroup["O_NEGATIVE"] = "O-";
    EBloodGroup["A_POSITIVE"] = "A+";
    EBloodGroup["A_NEGATIVE"] = "A-";
    EBloodGroup["B_POSITIVE"] = "B+";
    EBloodGroup["B_NEGATIVE"] = "B-";
    EBloodGroup["AB_POSITIVE"] = "AB+";
    EBloodGroup["AB_NEGATIVE"] = "AB-";
})(EBloodGroup || (exports.EBloodGroup = EBloodGroup = {}));
var ERole;
(function (ERole) {
    ERole["USER"] = "user";
    ERole["MODERATOR"] = "moderator";
    ERole["ADMIN"] = "admin";
})(ERole || (exports.ERole = ERole = {}));
var EEmployeeStatus;
(function (EEmployeeStatus) {
    EEmployeeStatus["PENDING"] = "pending";
    EEmployeeStatus["ACTIVE"] = "active";
    EEmployeeStatus["ARCHIVED"] = "archived";
})(EEmployeeStatus || (exports.EEmployeeStatus = EEmployeeStatus = {}));
//# sourceMappingURL=employee.type.js.map