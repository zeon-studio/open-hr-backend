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
exports.employeeEducationService = void 0;
const paginationHelper_1 = require("../../lib/paginationHelper");
const employee_education_model_1 = require("./employee-education.model");
// get all data
const getAllEmployeeEducationService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
            educations: 1,
            "employee.name": 1,
            "employee.image": 1,
        },
    });
    const result = yield employee_education_model_1.EmployeeEducation.aggregate(pipeline);
    const total = yield employee_education_model_1.EmployeeEducation.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getEmployeeEducationService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield employee_education_model_1.EmployeeEducation.findOne({ employee_id: id });
    return result;
});
// add or update
const updateEmployeeEducationService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const education = yield employee_education_model_1.EmployeeEducation.findOne({ platform: id });
    if (education) {
        // Update existing educations or add new ones
        updateData.educations.forEach((newEducation) => {
            const existingEducationIndex = education.educations.findIndex((education) => education.degree === newEducation.degree);
            if (existingEducationIndex !== -1) {
                // Update existing education
                education.educations[existingEducationIndex] = Object.assign(Object.assign({}, education.educations[existingEducationIndex]), newEducation);
            }
            else {
                // Add new education
                education.educations.push(newEducation);
            }
        });
        yield education.save();
        return education;
    }
    else {
        // Create new education if it doesn't exist
        const newEmployeeEducation = new employee_education_model_1.EmployeeEducation(updateData);
        yield newEmployeeEducation.save();
        return newEmployeeEducation;
    }
});
// delete
const deleteEmployeeEducationService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield employee_education_model_1.EmployeeEducation.findOneAndDelete({ employee_id: id });
});
exports.employeeEducationService = {
    getAllEmployeeEducationService,
    getEmployeeEducationService,
    deleteEmployeeEducationService,
    updateEmployeeEducationService,
};
//# sourceMappingURL=employee-education.service.js.map