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
exports.employeeDocumentController = void 0;
const constants_1 = require("../../config/constants");
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const filterPicker_1 = __importDefault(require("../../lib/filterPicker"));
const sendResponse_1 = require("../../lib/sendResponse");
const employee_document_service_1 = require("./employee-document.service");
// get all data
const getAllEmployeeDocumentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, filterPicker_1.default)(req.query, constants_1.paginationField);
    const filterOption = (0, filterPicker_1.default)(req.query, ["search"]);
    const employeeDocument = yield employee_document_service_1.employeeDocumentService.getAllEmployeeDocumentService(paginationOptions, filterOption);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employeeDocument.result,
        meta: employeeDocument.meta,
        message: "data get successfully",
    });
}));
// get single data
const getEmployeeDocumentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const employeeDocument = yield employee_document_service_1.employeeDocumentService.getEmployeeDocumentService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        result: employeeDocument,
        message: "data get successfully",
    });
}));
// update data
const updateEmployeeDocumentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    yield employee_document_service_1.employeeDocumentService.updateEmployeeDocumentService(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data updated successfully",
    });
}));
// delete data
const deleteEmployeeDocumentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId, documentId } = req.params;
    yield employee_document_service_1.employeeDocumentService.deleteEmployeeDocumentService({
        employeeId: employeeId,
        documentId: documentId,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "data deleted successfully",
    });
}));
exports.employeeDocumentController = {
    getAllEmployeeDocumentController,
    getEmployeeDocumentController,
    deleteEmployeeDocumentController,
    updateEmployeeDocumentController,
};
//# sourceMappingURL=employee-document.controller.js.map