"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetId = exports.generateEmployeeId = void 0;
const departmentShortName = {
    development: "DEV",
    marketing: "MKT",
    design: "DGN",
    admin: "ADM",
};
const findYear = (date) => {
    const year = date.getFullYear();
    return year;
};
const make3digit = (num) => {
    return num.toString().padStart(3, "0");
};
// employee id generator
const generateEmployeeId = (department, joining_date, departmentSerial) => {
    const userId = "TF" +
        departmentShortName[department] +
        findYear(joining_date) +
        make3digit(departmentSerial);
    return userId;
};
exports.generateEmployeeId = generateEmployeeId;
// asset id generator
const generateAssetId = (assetType, assetSerial) => {
    const assetId = "TF" + assetType + assetSerial;
    return assetId;
};
exports.generateAssetId = generateAssetId;
//# sourceMappingURL=IdGenerator.js.map