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
exports.toolController = void 0;
const constants_1 = require("../../config/constants");
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const filterPicker_1 = __importDefault(require("../../lib/filterPicker"));
const sendResponse_1 = require("../../lib/sendResponse");
const tool_service_1 = require("./tool.service");
// get all data
const getAllToolController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, filterPicker_1.default)(req.query, constants_1.paginationField);
    const filterOption = (0, filterPicker_1.default)(req.query, ["search"]);
    const tool = yield tool_service_1.toolService.getAllToolService(paginationOptions, filterOption);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: tool.result,
        meta: tool.meta,
        message: "data get successfully",
    });
}));
// get single data
const getToolController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const tool = yield tool_service_1.toolService.getToolService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: tool,
        message: "data get successfully",
    });
}));
// create data
const createToolController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const toolData = req.body;
    const tool = yield tool_service_1.toolService.createToolService(toolData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: tool,
        message: "data created successfully",
    });
}));
// update data
const updateToolController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    yield tool_service_1.toolService.updateToolService(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
    });
}));
// delete data
const deleteToolController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield tool_service_1.toolService.deleteToolService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data deleted successfully",
    });
}));
// get tool by user
const getToolByUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const tool = yield tool_service_1.toolService.getToolByUserService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: tool,
        message: "data get successfully",
    });
}));
exports.toolController = {
    getAllToolController,
    getToolController,
    createToolController,
    updateToolController,
    deleteToolController,
    getToolByUserController,
};
//# sourceMappingURL=tool.controller.js.map