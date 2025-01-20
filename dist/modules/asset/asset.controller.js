"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetController = void 0;
const constants_1 = require("../../config/constants");
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const filterPicker_1 = __importDefault(require("../../lib/filterPicker"));
const sendResponse_1 = require("../../lib/sendResponse");
const asset_service_1 = require("./asset.service");
// get all data
const getAllAssetController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, filterPicker_1.default)(req.query, constants_1.paginationField);
    const filterOption = (0, filterPicker_1.default)(req.query, ["search"]);
    const asset = yield asset_service_1.assetService.getAllAssetService(paginationOptions, filterOption);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: asset.result,
        meta: asset.meta,
        message: "data get successfully",
    });
}));
// get single data
const getAssetController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const asset = yield asset_service_1.assetService.getAssetService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: asset,
        message: "data get successfully",
    });
}));
// create data
const createAssetController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const assetData = req.body;
    const asset = yield asset_service_1.assetService.createAssetService(assetData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: asset,
        message: "data created successfully",
    });
}));
// update data
const updateAssetController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    yield asset_service_1.assetService.updateAssetService(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
    });
}));
// delete data
const deleteAssetController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield asset_service_1.assetService.deleteAssetService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data deleted successfully",
    });
}));
// get asset by user
const getAssetsByUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const asset = yield asset_service_1.assetService.getAssetsByUserService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: asset,
        message: "data get successfully",
    });
}));
exports.assetController = {
    getAllAssetController,
    getAssetController,
    createAssetController,
    updateAssetController,
    deleteAssetController,
    getAssetsByUserController,
};
//# sourceMappingURL=asset.controller.js.map