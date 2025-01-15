"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFormat = void 0;
const dateFormat = (date, pattern = "EEEE, dd MMMM, yyyy") => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const dayName = dateObj.toLocaleString("default", { weekday: "long" });
    const output = pattern
        .replace("dd", day.toString().padStart(2, "0"))
        .replace("MMMM", month)
        .replace("yyyy", year.toString())
        .replace("EEEE", dayName);
    return output;
};
exports.dateFormat = dateFormat;
//# sourceMappingURL=dateFormat.js.map