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
exports.assetService = void 0;
const IdGenerator_1 = require("../../lib/IdGenerator");
const paginationHelper_1 = require("../../lib/paginationHelper");
const asset_model_1 = require("./asset.model");
// get all data
const getAllAssetService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search, user } = filterOptions;
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { asset_id: { $regex: keyword, $options: "i" } },
                { user: { $regex: keyword, $options: "i" } },
            ],
        }));
        matchStage.$match.$or = searchConditions;
    }
    // user condition
    if (user) {
        matchStage.$match.user = user;
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
            _id: 0,
            asset_id: 1,
            user: 1,
            name: 1,
            type: 1,
            serial_number: 1,
            price: 1,
            currency: 1,
            purchase_date: 1,
            status: 1,
            note: 1,
            logs: 1,
        },
    });
    const result = yield asset_model_1.Asset.aggregate(pipeline);
    const total = yield asset_model_1.Asset.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getAssetService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield asset_model_1.Asset.findOne({ asset_id: id });
    return result;
});
// create
const createAssetService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // count data by type
    const assetSerial = (yield asset_model_1.Asset.countDocuments({ type: data.type })) + 1;
    const assetId = (0, IdGenerator_1.generateAssetId)(data.type, assetSerial);
    const createAssetData = {
        asset_id: assetId,
        user: data.user,
        name: data.name,
        type: data.type,
        serial_number: data.serial_number,
        price: data.price,
        currency: data.currency,
        purchase_date: data.purchase_date,
        status: data.status,
        logs: data.logs,
        note: data.note,
    };
    const newAssetData = new asset_model_1.Asset(createAssetData);
    const insertedAsset = yield newAssetData.save();
    return insertedAsset;
});
// update
const updateAssetService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield asset_model_1.Asset.findOneAndUpdate({ asset_id: id }, updateData, {
        new: true,
    });
    return result;
});
// delete
const deleteAssetService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield asset_model_1.Asset.findOneAndDelete({ asset_id: id });
});
// get asset by user
const getAssetsByUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        { $match: { user: id } },
        {
            $addFields: {
                handover: {
                    $last: {
                        $filter: {
                            input: "$logs",
                            as: "log",
                            cond: { $eq: ["$$log.type", "handover"] },
                        },
                    },
                },
            },
        },
        {
            $project: {
                asset_id: 1,
                user: 1,
                name: 1,
                type: 1,
                serial_number: 1,
                price: 1,
                currency: 1,
                purchase_date: 1,
                archive: 1,
                note: 1,
                handover: 1,
            },
        },
    ];
    const result = yield asset_model_1.Asset.aggregate(pipeline);
    return result;
});
exports.assetService = {
    getAllAssetService,
    getAssetService,
    createAssetService,
    updateAssetService,
    deleteAssetService,
    getAssetsByUserService,
};
//# sourceMappingURL=asset.service.js.map