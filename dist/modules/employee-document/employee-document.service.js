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
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeDocumentService = void 0;
const paginationHelper_1 = require("../../lib/paginationHelper");
const employee_document_model_1 = require("./employee-document.model");
// get all data
const getAllEmployeeDocumentService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search } = filterOptions;
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [{ employee_id: { $regex: keyword, $options: "i" } }],
        }));
        matchStage.$match.$or = searchConditions;
    }
    let pipeline = [matchStage];
    pipeline.push({ $sort: { createdAt: -1 } });
    if (skip) {
        pipeline.push({ $skip: skip });
    }
    if (limit) {
        pipeline.push({ $limit: limit });
    }
    pipeline.push({
        $lookup: {
            from: "employees",
            localField: "employee_id",
            foreignField: "id",
            as: "employee",
        },
    }, {
        $project: {
            _id: 0,
            employee_id: 1,
            banks: 1,
            "employee.name": 1,
            "employee.image": 1,
        },
    });
    const result = yield employee_document_model_1.EmployeeDocument.aggregate(pipeline);
    const total = yield employee_document_model_1.EmployeeDocument.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getEmployeeDocumentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_document_model_1.EmployeeDocument.findOne({ employee_id: id });
    return result;
});
// add or update
const updateEmployeeDocumentService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield employee_document_model_1.EmployeeDocument.findOne({ employee_id: id });
    if (document) {
        // Update existing documents or add new ones
        updateData.documents.forEach((newDocument) => {
            const existingDocumentIndex = document.documents.findIndex((document) => document.name === newDocument.name);
            if (existingDocumentIndex !== -1) {
                // Update existing document
                document.documents[existingDocumentIndex] = Object.assign(Object.assign({}, document.documents[existingDocumentIndex]), newDocument);
            }
            else {
                // Add new document
                document.documents.push(newDocument);
            }
        });
        yield document.save();
        return document;
    }
    else {
        // Create new document if it doesn't exist
        const newEmployeeDocument = new employee_document_model_1.EmployeeDocument(updateData);
        yield newEmployeeDocument.save();
        return newEmployeeDocument;
    }
});
// delete
const deleteEmployeeDocumentService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ employeeId, documentId, }) {
    yield employee_document_model_1.EmployeeDocument.updateOne({ employee_id: employeeId }, { $pull: { documents: { _id: documentId } } });
});
exports.employeeDocumentService = {
    getAllEmployeeDocumentService,
    getEmployeeDocumentService,
    deleteEmployeeDocumentService,
    updateEmployeeDocumentService,
};
//# sourceMappingURL=employee-document.service.js.map