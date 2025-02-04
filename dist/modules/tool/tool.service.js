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
    const { limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search, platform } = filterOptions;
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [
                { platform: { $regex: keyword, $options: "i" } },
                { website: { $regex: keyword, $options: "i" } },
            ],
        }));
        matchStage.$match.$or = searchConditions;
    }
    // platform condition
    if (platform) {
        matchStage.$match.platform = platform;
    }
    let pipeline = [matchStage];
    // Sorting stage
    pipeline.push({
        $sort: {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        },
    });
    if (skip) {
        pipeline.push({ $skip: skip });
    }
    if (limit) {
        pipeline.push({ $limit: limit });
    }
    pipeline.push({
        $project: {
            _id: 1,
            platform: 1,
            website: 1,
            organizations: 1,
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
const createToolService = (toolData) => __awaiter(void 0, void 0, void 0, function* () {
    const tool = new tool_model_1.Tool(toolData);
    yield tool.save();
    return tool;
});
// update
const updateToolService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const tool = yield tool_model_1.Tool.findOne({ _id: id });
    if (tool) {
        // Update existing tool
        const updatedTool = yield tool_model_1.Tool.findOneAndUpdate({ _id: id }, updateData, {
            new: true,
        });
        return updatedTool;
    }
    else {
        // Create new tool if it doesn't exist
        const newTool = new tool_model_1.Tool(updateData);
        yield newTool.save();
        return newTool;
    }
});
// delete
const deleteToolService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield tool_model_1.Tool.findOneAndDelete({ _id: id });
});
// get tool by user
const getToolByUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tools = yield tool_model_1.Tool.find({
        $or: [
            { "organizations.users": { $in: [id] } },
            { "organizations.users": { $in: ["everyone"] } },
        ],
    });
    const result = tools.flatMap((tool) => tool.organizations
        .filter((org) => org.users.includes(id))
        .map((org) => ({
        name: org.name,
        login_id: org.login_id,
        password: org.password,
        purchase_date: org.purchase_date,
        expire_date: org.expire_date,
        platform: tool.platform,
        website: tool.website,
        _id: org._id,
    })));
    return result;
});
exports.toolService = {
    getAllToolService,
    getToolService,
    createToolService,
    updateToolService,
    deleteToolService,
    getToolByUserService,
};
//# sourceMappingURL=tool.service.js.map