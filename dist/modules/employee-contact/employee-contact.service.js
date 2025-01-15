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
exports.employeeContactService = void 0;
const paginationHelper_1 = require("../../lib/paginationHelper");
const employee_contact_model_1 = require("./employee-contact.model");
// get all data
const getAllEmployeeContactService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
    pipeline.push({ $sort: { updatedAt: -1 } });
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
            contacts: 1,
            "employee.name": 1,
            "employee.image": 1,
        },
    });
    const result = yield employee_contact_model_1.EmployeeContact.aggregate(pipeline);
    const total = yield employee_contact_model_1.EmployeeContact.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getEmployeeContactService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_contact_model_1.EmployeeContact.findOne({ employee_id: id });
    return result;
});
// add or update
const updateEmployeeContactService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield employee_contact_model_1.EmployeeContact.findOne({ platform: id });
    if (contact) {
        // Update existing contacts or add new ones
        updateData.contacts.forEach((newContact) => {
            const existingContactIndex = contact.contacts.findIndex((contact) => contact.name === newContact.name);
            if (existingContactIndex !== -1) {
                // Update existing contact
                contact.contacts[existingContactIndex] = Object.assign(Object.assign({}, contact.contacts[existingContactIndex]), newContact);
            }
            else {
                // Add new contact
                contact.contacts.push(newContact);
            }
        });
        yield contact.save();
        return contact;
    }
    else {
        // Create new contact if it doesn't exist
        const newEmployeeContact = new employee_contact_model_1.EmployeeContact(updateData);
        yield newEmployeeContact.save();
        return newEmployeeContact;
    }
});
// delete
const deleteEmployeeContactService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield employee_contact_model_1.EmployeeContact.findOneAndDelete({ employee_id: id });
});
exports.employeeContactService = {
    getAllEmployeeContactService,
    getEmployeeContactService,
    deleteEmployeeContactService,
    updateEmployeeContactService,
};
//# sourceMappingURL=employee-contact.service.js.map