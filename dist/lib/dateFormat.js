"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateConvert = exports.dateFormat = void 0;
const date_fns_1 = require("date-fns");
const dateFormat = (date, pattern = "EEEE, dd MMMM, yyyy") => {
    if (!date || typeof date !== "string")
        return;
    const dateObj = new Date(date);
    const output = (0, date_fns_1.format)(dateObj, pattern);
    return output;
};
exports.dateFormat = dateFormat;
const dateConvert = (date) => {
    const utcDate = (0, date_fns_1.parseISO)(date);
    const dhakaTime = (0, date_fns_1.add)(utcDate, { hours: 6 });
    const formattedDate = (0, date_fns_1.format)(dhakaTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    return formattedDate;
};
exports.dateConvert = dateConvert;
//# sourceMappingURL=dateFormat.js.map