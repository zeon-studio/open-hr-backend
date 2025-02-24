"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetId = exports.generateEmployeeId = void 0;
const variables_1 = __importDefault(require("../config/variables"));
const departmentGenerator = {
    development: "DEV",
    marketing: "MKT",
    design: "DGN",
    admin: "ADM",
    production: "PDC",
    hr_finance: "HRF",
    other: "OTH",
};
const assetTypeGenerator = {
    macbook: "MBK",
    macmini: "MNI",
    imac: "IMC",
    laptop: "LPT",
    desktop: "DPT",
    mobile: "MBL",
    keyboard: "KBD",
    mouse: "MUS",
    monitor: "MON",
    headset: "HST",
    printer: "PRN",
    router: "RTR",
    other: "OTH",
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
    const userId = variables_1.default.id_prefix +
        departmentGenerator[department] +
        findYear(joining_date) +
        make3digit(departmentSerial);
    return userId;
};
exports.generateEmployeeId = generateEmployeeId;
// asset id generator
const generateAssetId = (assetType, assetSerial) => {
    const assetId = variables_1.default.id_prefix +
        "_" +
        assetTypeGenerator[assetType] +
        "_" +
        assetSerial.toString();
    return assetId;
};
exports.generateAssetId = generateAssetId;
//# sourceMappingURL=IdGenerator.js.map