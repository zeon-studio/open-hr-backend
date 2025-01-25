"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetId = exports.generateEmployeeId = void 0;
const departmentGenerator = {
    development: "DEV",
    marketing: "MKT",
    design: "DGN",
    admin: "ADM",
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
    const userId = "TF" +
        departmentGenerator[department] +
        findYear(joining_date) +
        make3digit(departmentSerial);
    return userId;
};
exports.generateEmployeeId = generateEmployeeId;
// asset id generator
const generateAssetId = (assetType, assetSerial) => {
    const assetId = "TF_" + assetTypeGenerator[assetType] + "_" + assetSerial.toString();
    return assetId;
};
exports.generateAssetId = generateAssetId;
//# sourceMappingURL=IdGenerator.js.map