"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EAssetStatus = exports.EAssetType = exports.EAssetLogType = exports.ECurrency = void 0;
var ECurrency;
(function (ECurrency) {
    ECurrency["BDT"] = "bdt";
    ECurrency["USD"] = "usd";
})(ECurrency || (exports.ECurrency = ECurrency = {}));
var EAssetLogType;
(function (EAssetLogType) {
    EAssetLogType["HANDOVER"] = "handover";
    EAssetLogType["REPAIR"] = "repair";
    EAssetLogType["TAKEOVER"] = "takeover";
    EAssetLogType["OTHER"] = "other";
})(EAssetLogType || (exports.EAssetLogType = EAssetLogType = {}));
var EAssetType;
(function (EAssetType) {
    EAssetType["MACBOOK"] = "macbook";
    EAssetType["MACMINI"] = "macmini";
    EAssetType["IMAC"] = "imac";
    EAssetType["LAPTOP"] = "laptop";
    EAssetType["DESKTOP"] = "desktop";
    EAssetType["MOBILE"] = "mobile";
    EAssetType["KEYBOARD"] = "keyboard";
    EAssetType["MOUSE"] = "mouse";
    EAssetType["MONITOR"] = "monitor";
    EAssetType["HEADSET"] = "headset";
    EAssetType["PRINTER"] = "printer";
    EAssetType["ROUTER"] = "router";
    EAssetType["OTHER"] = "other";
})(EAssetType || (exports.EAssetType = EAssetType = {}));
var EAssetStatus;
(function (EAssetStatus) {
    EAssetStatus["ENGAGED"] = "engaged";
    EAssetStatus["ARCHIVED"] = "archived";
    EAssetStatus["LOST"] = "lost";
    EAssetStatus["DAMAGED"] = "damaged";
    EAssetStatus["SOLD"] = "sold";
})(EAssetStatus || (exports.EAssetStatus = EAssetStatus = {}));
//# sourceMappingURL=asset.type.js.map