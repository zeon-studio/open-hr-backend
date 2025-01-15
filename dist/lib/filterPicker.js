"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const pick = (obj, keys) => {
    const findObject = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            findObject[key] = obj[key];
        }
    }
    return findObject;
};
exports.default = pick;
//# sourceMappingURL=filterPicker.js.map