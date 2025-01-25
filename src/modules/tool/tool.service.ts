import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { Tool } from "./tool.model";
import { ToolFilterOptions, ToolType } from "./tool.type";

// get all data
const getAllToolService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<ToolFilterOptions>
) => {
  let matchStage: any = {
    $match: {},
  };
  const { limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

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

  let pipeline: PipelineStage[] = [matchStage];

  pipeline.push({ $sort: { updatedAt: -1 } });

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

  const result = await Tool.aggregate(pipeline);
  const total = await Tool.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getToolService = async (id: string) => {
  const result = await Tool.findOne({ tool_id: id });
  return result;
};

// create
const createToolService = async (toolData: ToolType) => {
  const tool = new Tool(toolData);
  await tool.save();
  return tool;
};

// update
const updateToolService = async (id: string, updateData: ToolType) => {
  const tool = await Tool.findOne({ _id: id });

  if (tool) {
    // Update existing tool
    const updatedTool = await Tool.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    return updatedTool;
  } else {
    // Create new tool if it doesn't exist
    const newTool = new Tool(updateData);
    await newTool.save();
    return newTool;
  }
};

// delete
const deleteToolService = async (id: string) => {
  await Tool.findOneAndDelete({ _id: id });
};

// get tool by user
const getToolByUserService = async (id: string) => {
  const tools = await Tool.find({
    $or: [
      { "organizations.users": { $in: [id] } },
      { "organizations.users": { $in: ["everyone"] } },
    ],
  });

  const result = tools.flatMap((tool) =>
    tool.organizations
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
      }))
  );

  return result;
};

export const toolService = {
  getAllToolService,
  getToolService,
  createToolService,
  updateToolService,
  deleteToolService,
  getToolByUserService,
};
