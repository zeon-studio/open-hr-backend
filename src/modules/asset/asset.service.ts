import { generateAssetId } from "@/lib/IdGenerator";
import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { Asset } from "./asset.model";
import { AssetFilterOptions, AssetType } from "./asset.type";

// get all data
const getAllAssetService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<AssetFilterOptions>
) => {
  let matchStage: any = {
    $match: {},
  };
  const { limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract search and filter options
  const { search, user } = filterOptions;

  // Search condition
  if (search) {
    const searchKeyword = String(search).replace(/\+/g, " ");
    const keywords = searchKeyword.split("|");
    const searchConditions = keywords.map((keyword) => ({
      $or: [{ name: { $regex: keyword, $options: "i" } }],
    }));
    matchStage.$match.$or = searchConditions;
  }

  // user condition
  if (user) {
    matchStage.$match.user = user;
  }

  let pipeline: PipelineStage[] = [matchStage];

  pipeline.push({ $sort: { updatedAt: -1 } });

  if (skip) {
    pipeline.push({ $skip: skip });
  }
  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push(
    {
      $lookup: {
        from: "employees",
        localField: "user",
        foreignField: "id",
        as: "employee",
      },
    },
    {
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
        archive: 1,
        note: 1,
        logs: 1,
        "employee.name": 1,
        "employee.image": 1,
      },
    }
  );

  const result = await Asset.aggregate(pipeline);
  const total = await Asset.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getAssetService = async (id: string) => {
  const result = await Asset.findOne({ asset_id: id });
  return result;
};

// create
const createAssetService = async (data: AssetType) => {
  // count data by type
  const assetSerial = (await Asset.countDocuments({ type: data.type })) + 1;
  const assetId = generateAssetId(data.type, assetSerial);

  const createAssetData = {
    asset_id: assetId,
    user: data.user,
    name: data.name,
    type: data.type,
    serial_number: data.serial_number,
    price: data.price,
    currency: data.currency,
    purchase_date: data.purchase_date,
    archive: data.archive,
    note: data.note,
  };

  const newAssetData = new Asset(createAssetData);
  const insertedAsset = await newAssetData.save();

  return insertedAsset;
};

// update
const updateAssetService = async (id: string, updateData: AssetType) => {
  const result = await Asset.findOneAndUpdate({ asset_id: id }, updateData, {
    new: true,
  });
  return result;
};

// delete
const deleteAssetService = async (id: string) => {
  await Asset.findOneAndDelete({ asset_id: id });
};

// get asset by user
const getAssetsByUserService = async (id: string) => {
  const pipeline: PipelineStage[] = [
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

  const result = await Asset.aggregate(pipeline);
  return result;
};

export const assetService = {
  getAllAssetService,
  getAssetService,
  createAssetService,
  updateAssetService,
  deleteAssetService,
  getAssetsByUserService,
};
