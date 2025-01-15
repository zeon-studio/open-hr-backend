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
exports.toolService = void 0;
const paginationHelper_1 = require("../../lib/paginationHelper");
const tool_model_1 = require("./tool.model");
// get all data
const getAllToolService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search, platform } = filterOptions;
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [{ name: { $regex: keyword, $options: "i" } }],
        }));
        matchStage.$match.$or = searchConditions;
    }
    // platform condition
    if (platform) {
        matchStage.$match.platform = platform;
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
            localField: "organizations.users",
            foreignField: "id",
            as: "employee",
        },
    }, {
        $project: {
            _id: 0,
            platform: 1,
            website: 1,
            organizations: 1,
            "employee.name": 1,
            "employee.image": 1,
        },
    });
    const result = yield tool_model_1.Tool.aggregate(pipeline);
    const total = yield tool_model_1.Tool.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getToolService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tool_model_1.Tool.findOne({ tool_id: id });
    return result;
});
// create
const createToolService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tool_model_1.Tool.create(data);
    return result;
});
// update
const updateToolService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tool_model_1.Tool.findOneAndUpdate({ tool_id: id }, updateData, {
        new: true,
    });
    return result;
});
// delete
const deleteToolService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield tool_model_1.Tool.findOneAndDelete({ tool_id: id });
});
exports.toolService = {
    getAllToolService,
    getToolService,
    createToolService,
    updateToolService,
    deleteToolService,
};
//# sourceMappingURL=tool.service.js.map