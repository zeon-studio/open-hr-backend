"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateConvert = exports.dateFormat = void 0;
const date_fns_1 = require("date-fns");
const dateFormat = (date, pattern = "EEEE, dd MMMM, yyyy") => {
    if (!date)
        return;
    const dateObj = new Date(date);
    const output = (0, date_fns_1.format)(dateObj, pattern);
    return output;
};
exports.dateFormat = dateFormat;
const dateConvert = (date) => {
    const removeTime = new Date(date).toISOString().split("T")[0];
    const utcDate = new Date(removeTime);
    const dhakaTime = (0, date_fns_1.add)(utcDate, { hours: 6 });
    console.log("dhakaTime", dhakaTime);
    return dhakaTime;
};
exports.dateConvert = dateConvert;
//# sourceMappingURL=dateFormat.js.map